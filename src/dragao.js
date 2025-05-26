(function dragonko() {
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
    
    const spriteSets = {
        idle: [[0, 0]],
        alert: [[-1, 0]],
        fire: [[-2, 0], [-3, 0], [-4, 0], [-3, 0], [-2, 0]],
        tired: [[-1, -1]],
        sleeping: [[0, -1], [1, -1]],
        N: [[0, -2], [1, -2]],
        NE: [[2, -2], [3, -2]],
        E: [[-1, -2], [-2, -2]],
        SE: [[-3, -2], [-4, -2]],
        S: [[-5, -2], [-6, -2]],
        SW: [[-3, -3], [-4, -3]],
        W: [[-1, -3], [-2, -3]],
        NW: [[0, -3], [1, -3]],
    };

    function create() {
        dragonEl.id = "dragonko";
        dragonEl.style.width = "32px";
        dragonEl.style.height = "32px";
        dragonEl.style.position = "fixed";
        dragonEl.style.backgroundImage = "url('./dragao.gif')";
        dragonEl.style.imageRendering = "pixelated";
        dragonEl.style.left = "16px";
        dragonEl.style.top = "16px";

        document.body.appendChild(dragonEl);

        document.onmousemove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.dragonkoInterval = setInterval(frame, 100);
    }

    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        dragonEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdle() {
        idleAnimation = null;
        idleFrame = 0;
    }

    function idle() {
        idleTime += 1;

        if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && !idleAnimation) {
            idleAnimation = ["sleeping", "fire"][Math.floor(Math.random() * 2)];
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
            case "fire":
                setSprite("fire", idleFrame);
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
