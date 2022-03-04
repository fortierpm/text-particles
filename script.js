const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

let adjustX = 5;
let adjustY = 0;


// handle mouse
let mouse = {
    x: null,
    y: null,
    radius: 100
}
window.addEventListener("mousemove", (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});


// text
ctx.fillStyle = "white";
ctx.font = "30px Verdana";
ctx.fillText("SADIE", 0, 30);
// text data
const textCoords = ctx.getImageData(0, 0, 200, 50);


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = this.x; // to save original pos
        this.baseY = this.y; // to save original pos
        this.size = 1;
        this.density = (Math.random() * 40) + 10; // gives variety to particle movement speeds
    }
    draw() {
        ctx.fillStyle = "azure";
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


function init() {
    particleArray = [];
    /* ---------------------------
    Nested For loop scanning
       _x1__x2__x3__x4__...
    y1| =================> 1st
    y2| =================> 2nd
    y3| =================> 3rd
    y4| ...
    like so down entire canvas
    --------------------------- */
    for (let y = 0, y2 = textCoords.height; y < y2; y++) {
        for (let x = 0, x2 = textCoords.width; x < x2; x++) {
            if (textCoords.data[(y * 4 * textCoords.width) + (x * 4) + 3] > 128) { // if above ~50% opacity
                let posX = x + adjustX;
                let posY = y + adjustY;
                particleArray.push(new Particle(posX * 10, posY * 10));
            }
        }
    }
}
init();


function connectLines() {
    let opacityValue = 1;
    ctx.strokeStyle = "azure";
    for (let a = 0; a < particleArray.length; a++) {
        for (let b = a; b < particleArray.length; b++) {
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.hypot(dx, dy); // d = sqrt(v1^2 + v2^2)

            /* For better effect, requires strong machine */
            //opacityValue = 1 - (distance/50);
            //ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;

            if (distance < 20) {
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }

    connectLines();

    requestAnimationFrame(animate);
}
animate();
