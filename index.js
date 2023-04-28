
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;


const gravity = 0.5;

class Player {
    constructor() {
        this.position = {
            x: 100,
            y: 200,
        }

        this.velocity = {
            x: 0,
            y: 1,
        }
        this.width = 30;
        this.height = 30;
    }

    draw() {
        c.fillStyle = 'red';

        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }

    update() {
        this.draw();

        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.position.y += this.velocity.y;
            this.velocity.y += gravity;
        } else {
            this.velocity.y = 0;
        }
    }

}
const platformPath = './images/platform.png';
const platformImage = new Image();
platformImage.src = platformPath;

const hillsPath = './images/hills.png';
const hillsImage = new Image();
hillsImage.src = hillsPath;

const backgroundPath = './images/background.png';
const backgroundImage = new Image();
backgroundImage.src = backgroundPath;

const platformSmallTall = './images/platformSmallTall.png';
const platformSmallTallImage = new Image();
platformSmallTallImage.src = platformSmallTall;

class Platform {
    constructor(x, y, platformImage) {
        this.position = { 
            x: x,
            y: y,
        }

        this.platformImage = platformImage;
        this.width = this.platformImage.width;
        this.height = 20;
    }

    draw() {
        c.drawImage(this.platformImage, this.position.x, this.position.y)
    }
}


class GenericObject  {
    constructor(x, y, platformImage) {
        this.position = { 
            x: x,
            y: y,
        }

        this.platformImage = platformImage;
        this.width = this.platformImage.width;
        this.height = 20;
    }

    draw() {
        c.drawImage(this.platformImage, this.position.x, this.position.y)
    }
}

let player;
let platforms;
let genericObjects;

function init() {
    player = new Player();
    platforms = [
        new Platform(platformImage.width * 2 - 2 + 150, 370, platformSmallTallImage),
        new Platform(platformImage.width * 1 - 2 + 150, 270, platformSmallTallImage),
        new Platform(platformImage.width * 3 - 2 + 150, 400, platformSmallTallImage),
        new Platform(0, 470, platformImage), 
        new Platform(platformImage.width - 2, 470, platformImage), 
        new Platform(platformImage.width * 2 - 2 + 100, 470, platformImage), 
        new Platform(platformImage.width * 2 - 2 + 100, 470, platformImage), 
        new Platform(platformImage.width * 3 - 2 + 250, 470, platformImage), 
        new Platform(platformImage.width * 4 - 2 + 350, 470, platformImage),
    ];
    genericObjects = [new GenericObject(-1, -1, backgroundImage), new GenericObject(0, 100, hillsImage)];
}

init();

const keys = {
    right: {
        pressed: false,
    },
    left: {
        pressed: false,
    }
}

let leftOffset = 100;
let additionalStepValue = 0;
let jumpClicks = 0;

function animate () {
    c.clearRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(animate);

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = 5;
    } else  if (keys.left.pressed && player.position.x > 100){
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;
    }

    if (keys.right.pressed) {
        additionalStepValue +=5;
    } else if (keys.left.pressed && leftOffset > 100){
        additionalStepValue -=5;
    }

    [...genericObjects, ...platforms].forEach((gen) => {
        gen.draw();
        if (keys.right.pressed) {
            leftOffset++;
            gen.position.x -= 5;
        } else if (keys.left.pressed && leftOffset > 100) {
            leftOffset--;
            gen.position.x += 5;
        }
    });

    platforms.forEach((platform, i) => {    
        if (player.position.y + player.height <= platform.position.y 
            && player.position.y + player.height + player.velocity.y >= platform.position.y 
            && (player.position.x + player.width >= platform.position.x 
            && player.position.x <= platform.position.x + platform.width)) {
            player.velocity.y = 0;
            jumpClicks = 0;
        }
    });

    player.update();

    if (player.position.y + player.height + 20 >= canvas.height) {
        init();
    }
}

animate();

addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 65: {
            keys.left.pressed = true;
            break;
        }
        case 83: {
            break;
        }
        case 68: {
            keys.right.pressed = true;
            break;
        }
        case 87: {
            if (jumpClicks > 1) {
                break;
            }
            jumpClicks++;
            player.velocity.y -= 10;
            break;
        }
    }
});

addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        case 65: {
            keys.left.pressed = false;
            break;
        }
        case 83: {
            break;
        }
        case 68: {
            keys.right.pressed = false;
            break;
        }
        case 87: {
            break;
        }
    }
})