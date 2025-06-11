(function () {
    const API_LOG_URL = "https://api.cebolitos.cloud/salvar";

    console.log("%c[Monitor de Network Ativado com Upload e Filtro 'eduspa']", "color: green; font-weight: bold;");

    function formatHeaders(headers) {
        if (!headers) return {};
        return headers.entries
            ? Object.fromEntries(headers.entries())
            : Object.fromEntries(Object.entries(headers));
    }

    function shouldLog(url) {
        return typeof url === "string";
    }

    async function enviarParaAPI(tipo, payload) {
        try {
            const dados = {
                tipo,
                timestamp: new Date().toISOString(),
                ...payload,
            };

            const jsonString = JSON.stringify(dados);
            const sizeInBytes = new TextEncoder().encode(jsonString).length;
            console.log(`[LOG SIZE] Enviando payload de ${sizeInBytes} bytes para ${API_LOG_URL}`);

            const enviado = navigator.sendBeacon(
                API_LOG_URL,
                new Blob([jsonString], { type: "application/json" })
            );

            if (!enviado) {
                await fetch(API_LOG_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: jsonString,
                    credentials: "omit",
                });
            }
        } catch (err) {
            console.warn("[LOG API ERROR]", err);
        }
    }

    function logRequest(type, url, method, headers, body) {
        if (!shouldLog(url)) return;

        const data = {
            evento: "request",
            url,
            metodo: method,
            headers: formatHeaders(headers),
            body: body || null,
        };

        console.groupCollapsed(`%c[${type} REQUEST] ${method} → ${url}`, "color: cyan; font-weight: bold;");
        console.log(data);
        console.groupEnd();

        enviarParaAPI(type, data);
    }

    function logResponse(type, url, status, headers, body) {
        if (!shouldLog(url)) return;

        const data = {
            evento: "response",
            url,
            status,
            headers: formatHeaders(headers),
            body: body || null,
        };

        console.groupCollapsed(`%c[${type} RESPONSE] ${status} ← ${url}`, "color: lightgreen; font-weight: bold;");
        console.log(data);
        console.groupEnd();

        enviarParaAPI(type, data);
    }

    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
        const [resource, options] = args;
        const url = typeof resource === "string" ? resource : resource.url;

        logRequest("FETCH", url, options?.method || "GET", options?.headers, options?.body);

        try {
            const response = await originalFetch(...args);
            const clone = response.clone();

            clone.text().then(body => {
                logResponse("FETCH", url, response.status, response.headers, body);
            });

            return response;
        } catch (err) {
            console.error("[FETCH ERROR]", err);
            throw err;
        }
    };

    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = class extends originalXHR {
        constructor() {
            super();

            this.addEventListener("load", function () {
                if (!shouldLog(this.responseURL)) return;

                const headers = this.getAllResponseHeaders()
                    .split("\r\n")
                    .reduce((acc, line) => {
                        const [key, val] = line.split(": ");
                        if (key) acc[key] = val;
                        return acc;
                    }, {});

                logResponse("XHR", this.responseURL, this.status, headers, this.responseText);
            });

            this.addEventListener("error", function () {
                console.error("[XHR ERROR]", this.responseURL);
            });
        }

        open(method, url, ...rest) {
            this._method = method;
            this._url = url;
            super.open(method, url, ...rest);
        }

        send(body) {
            if (shouldLog(this._url)) {
                logRequest("XHR", this._url, this._method, {}, body);
            }
            super.send(body);
        }
    };

    const originalSendBeacon = navigator.sendBeacon;
    navigator.sendBeacon = function (url, data) {
        if (shouldLog(url)) {
            logRequest("BEACON", url, "POST", {}, data);
        }
        return originalSendBeacon.call(navigator, url, data);
    };
})();
