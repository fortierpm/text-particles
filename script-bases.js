
/* !!! (1) INTERACTIVE PARTICLES !!! */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// handle mouse
let mouse = {
    x: null,
    y: null,
    radius: 150
}
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// text
ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("A", 50, 40);
// data
const data = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x; // to save original pos
        this.baseY = this.y; // to save original pos
        this.size = 3;
        this.density = (Math.random() * 30) + 1;
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy); // d = sqrt(v1^2 + v2^2)
        if (distance < 100) {
            this.size = 50;
        } else {
            this.size = 3;
        }
    }
}

const init = () => {
    particleArray = [];
    for (let i = 0; i < 100; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x, y));
    }
}
init();

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update()
    }
    requestAnimationFrame(animate);
}
animate();





/* !!! (2) PARTICLES MOVE AWAY AND RETURN !!! */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// handle mouse
let mouse = {
    x: null,
    y: null,
    radius: 150
}
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// text
ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("A", 50, 40);

// data
const data = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x; // to save original pos
        this.baseY = this.y; // to save original pos
        this.size = 3;
        this.density = (Math.random() * 40) + 5; // gives variety to particle movement speeds
    }
    draw() {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.hypot(dx, dy); // d = sqrt(v1^2 + v2^2)
        
        let forceDirX = dx / distance;
        let forceDirY = dy / distance;

        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
            // above determines value between 1 and 0 as multiplier against max speed based on distance away from mouse
        
        let dirX = forceDirX * force * this.density;
        let dirY = forceDirY * force * this.density;


        if (distance < mouse.radius) { // move away
            this.x -= dirX;
            this.y -= dirY;
        } else { // return
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}

const init = () => {
    particleArray = [];
    for (let i = 0; i < 200; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x, y));
    }
}
init();

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update()
    }
    requestAnimationFrame(animate);
}
animate();
