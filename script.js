const canvas = document.getElementById('storm-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let elementParticles = [];

const data = {
    endemor: {
        name: "ENDEMOR",
        subtitle: "The Equilibrium of Elements",
        accent: "#ff4d00",
        icon: `<img src="The Endemor (2).png">`,
        desc: "Born from the core of a dying star and the absolute zero of the nebula, Endemor is the primary defender of The Entity universe. He possesses the unique ability to channel thermal energy and sub-zero stasis simultaneously. In the game, Endemor plays as a high-intensity brawler who can freeze enemies in place before shattering them with meteor-level impacts.",
        stats: ["STRENGTH: 9/10", "SPEED: 8/10", "CONTROL: 10/10"]
    },
    demenoir: {
        name: "DEMENOIR",
        subtitle: "The Gale of the Great Void",
        accent: "#84cc16",
        icon: `<img src="The Demenoir.png">`,
        desc: "Demenoir was once a shadow of Endemor, but found power in the 'Fracture'—the space between reality. He manipulates air not as life, but as a weapon of erosion and storm. His presence in 'The Entity' represents the chaotic entropy of nature. He is a master of mobility, using vortexes to teleport across the battlefield and suffocating opponents with vacuum-sealed combat zones.",
        stats: ["STRENGTH: 7/10", "SPEED: 10/10", "CHAOS: 10/10"]
    }
};

class P {
    constructor() {
        this.x = Math.random() * innerWidth;
        this.y = Math.random() * innerHeight;
        this.speed = Math.random() * 2 + 0.5;
    }
    draw() {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();

        this.y -= this.speed;
        if (this.y < 0) this.y = innerHeight;
    }
}

class ElementParticle {
    constructor(type) {
        this.type = type;
        this.reset();
    }

    reset() {
        this.x = Math.random() * innerWidth;
        this.y = Math.random() * innerHeight;
        this.size = Math.random() * 3 + 1;
        this.alpha = Math.random();
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
    }

    update() {
        if (this.type === "fire") {
            this.y -= 2;
            this.x += this.speedX * 0.2;
        }

        if (this.type === "wind") {
            this.x += this.speedX * 3;
            this.y += Math.sin(this.x * 0.01);
        }

        if (this.y < 0 || this.x < 0 || this.x > innerWidth) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle =
            this.type === "fire"
                ? `rgba(255,80,0,${this.alpha})`
                : `rgba(120,200,255,${this.alpha})`;

        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    particles = [];

    for (let i = 0; i < 80; i++) {
        particles.push(new P());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => p.draw());

    if (elementParticles.length > 0) {
        elementParticles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
    }

    requestAnimationFrame(animate);
}

function openLore(key) {
    const char = data[key];
    const modal = document.getElementById('char-modal');
    const body = document.getElementById('lore-body');

    document.documentElement.style.setProperty('--accent', char.accent);

    modal.style.display = 'block';
    modal.style.opacity = 0;
    modal.style.transform = "scale(1.3)";

    setTimeout(() => {
        modal.style.transition = "0.6s ease";
        modal.style.opacity = 1;
        modal.style.transform = "scale(1)";
    }, 50);

    body.innerHTML = `
        <div class="lore-text">
            <h2 style="color:${char.accent}">${char.name}</h2>
            <p style="color:#666">${char.subtitle}</p>
            <div class="description">${char.desc}</div>
            <div class="stats-box">
                ${char.stats.map(s => `<div class="stat-item">${s}</div>`).join('')}
            </div>
        </div>
        <div class="visual-placeholder">
            ${char.icon}
        </div>
    `;

    startElementParticles(key);
}

function closeLore() {
    document.getElementById('char-modal').style.display = 'none';
    elementParticles = [];
}

function startElementParticles(key) {
    elementParticles = [];

    let type = null;
    if (key === "endemor") type = "fire";
    if (key === "demenoir") type = "wind";

    if (!type) return;

    for (let i = 0; i < 80; i++) {
        elementParticles.push(new ElementParticle(type));
    }
}

init();
animate();
window.onresize = init;