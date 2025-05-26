(function dragaozinho() {
    const dragonEl = document.createElement("div");
    let dragonX = 32;
    let dragonY = 32;
    let mouseX = 0;
    let mouseY = 0;
    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation = null;
    let idleFrame = 0;
    const speed = 10;

    // Mapas corrigidos com coordenadas POSITIVAS baseadas no sprite sheet real
    const spriteSets = {
        idle: [[3, 3]],
        alert: [[7, 3]],
        scratch: [
            [5, 0],
            [6, 0],
            [7, 0],
        ],
        tired: [[3, 2]],
        sleeping: [
            [2, 0],
            [2, 1],
        ],
        N: [
            [1, 2],
            [1, 3],
        ],
        NE: [
            [0, 2],
            [0, 3],
        ],
        E: [
            [3, 0],
            [3, 1],
        ],
        SE: [
            [5, 1],
            [5, 2],
        ],
        S: [
            [6, 3],
            [7, 2],
        ],
        SW: [
            [5, 3],
            [6, 1],
        ],
        W: [
            [4, 2],
            [4, 3],
        ],
        NW: [
            [1, 0],
            [1, 1],
        ],
    };

    function create() {
        dragonEl.id = "dragaozinho";
        dragonEl.style.width = "32px";
        dragonEl.style.height = "32px";
        dragonEl.style.position = "fixed";
        dragonEl.style.backgroundImage = "url('./dragao.png')";
        dragonEl.style.imageRendering = "pixelated";
        dragonEl.style.backgroundRepeat = "no-repeat";
        dragonEl.style.left = "16px";
        dragonEl.style.top = "16px";

        document.body.appendChild(dragonEl);

        document.onmousemove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.dragaozinhoInterval = setInterval(frame, 100);
    }

    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        const x = sprite[0] * 32;
        const y = sprite[1] * 32;
        dragonEl.style.backgroundPosition = `-${x}px -${y}px`;
    }

    function resetIdle() {
        idleAnimation = null;
        idleFrame = 0;
    }

    function idle() {
        idleTime += 1;

        if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && !idleAnimation) {
            idleAnimation = ["sleeping", "scratch"][Math.floor(Math.random() * 2)];
        }

        switch (idleAnimation) {
            case "sleeping":
                if (idleFrame < 8) {
                    setSprite("tired", 0);
                    break;
                }
                setSprite("sleeping", Math.floor(idleFrame / 4));
                if (idleFrame > 192) resetIdle();
                break;
            case "scratch":
                setSprite("scratch", idleFrame);
                if (idleFrame > 9) resetIdle();
                break;
            default:
                setSprite("idle", 0);
                return;
        }
        idleFrame++;
    }

    function frame() {
        frameCount++;
        const dx = dragonX - mouseX;
        const dy = dragonY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < speed || dist < 48) {
            idle();
            return;
        }

        resetIdle();

        if (idleTime > 1) {
            setSprite("alert", 0);
            idleTime = Math.min(idleTime, 7);
            idleTime -= 1;
            return;
        }

        let dir = "";
        if (dy / dist > 0.5) dir += "N";
        if (dy / dist < -0.5) dir += "S";
        if (dx / dist > 0.5) dir += "W";
        if (dx / dist < -0.5) dir += "E";

        setSprite(dir, frameCount);

        dragonX -= (dx / dist) * speed;
        dragonY -= (dy / dist) * speed;

        dragonEl.style.left = `${dragonX - 16}px`;
        dragonEl.style.top = `${dragonY - 16}px`;
    }

    create();
})();
