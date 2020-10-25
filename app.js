////////////////////////////////
//     Game configuration     //
const platformLowestStartBottom = 100;
const platformCount = 5;
const platformFallSpeed = 4;
const doodlerJumpSpeed = 25;
const doodlerJumpHeight = 200;
const doodlerFallSpeed = 6;
const doodlerHorizontalSpeed = 10
const doodlerInitialBottom = 150;

////////////////////////////////
//        Global State        //
const platforms = []
let doodler
////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    
    // create platforms
    for(let i=0; i < platformCount; i++) {
        let platformGap = 600 / platformCount;
        let newPlaformBottom = platformLowestStartBottom + i * platformGap;
        let newPlatform = new Platform(grid, newPlaformBottom)
        platforms.push(newPlatform)
    }
    
    doodler = new Doodler(grid, doodlerInitialBottom, platforms[0].left)
   
    

    // Start Game TODO: attach button    
    window.addEventListener('keydown', doodler.control);
    window.addEventListener('keyup', doodler.control);
    console.log('Game Started')
    doodler.jump()
});


class Doodler {
    jumpTimer = null;
    fallTimer = null;
    leftTimerId = null;
    rightTimerId = null;
    jumpingStartPoint;
    
    constructor(parent, bottom, left) {
        this.bottom = bottom;
        this.left = left;
        this.visual = document.createElement('div')
        this.jumpingStartPoint = bottom;

        this.visual.classList.add('doodler');
        this.visual.style.left = this.left + 'px';
        this.visual.bottom = this.bottom + 'px';

        parent.appendChild(this.visual);
    }

    control(e) {
        if (e.type == "keyup") {
            clearInterval(this.leftTimerId)
            clearInterval(this.rightTimerId)
            return;
        }
        if (e.key == "ArrowLeft") {
            console.log('going left')
            clearInterval(this.leftTimerId)
            clearInterval(this.rightTimerId)
            this.leftTimerId = setInterval(function() {
                if (doodler.left <= 0) {
                    doodler.left = 0;
                    doodler.visual.style.left = doodler.left + 'px';
                    return;
                };
                doodler.left -= doodlerHorizontalSpeed;
                doodler.visual.style.left = doodler.left + 'px';
            }.bind(this), 30);
        } else if (e.key === 'ArrowRight') {
            console.log('going right')
            clearInterval(this.leftTimerId)
            clearInterval(this.rightTimerId)
            this.rightTimerId = setInterval(function() {
                if ((doodler.left + 60) >= 400) return;
                doodler.left += doodlerHorizontalSpeed;
                doodler.visual.style.left = doodler.left + 'px';
            }, 30);
        }
    }
    
    jump() {
        clearInterval(this.jumpTimer)
        clearInterval(this.fallTimer)
        console.log("Start jumping")
        this.fallTimer = null;
        this.jumpingStartPoint = this.bottom
        const targetheight = this.jumpingStartPoint + doodlerJumpHeight
        this.jumpTimer = setInterval(function() {
            doodler.bottom += doodlerJumpSpeed;
            doodler.visual.style.bottom = doodler.bottom + 'px';
            if (doodler.bottom > 500
                || this.bottom >= targetheight
                ) {
                    console.log("Shall I fall now?")
                    this.startFalling()
                }
            }.bind(this),30);
        }
        
    startFalling() {
        console.log("Start falling")
        clearInterval(this.jumpTimer)
        clearInterval(this.fallTimer)
        this.jumpTimer = null;
        
        this.fallTimer = setInterval(function () {
            // evaluate collision bottom ==> game over
            if (this.bottom <= (0 - this.visual.style.height)) {
                console.log("Game Over");
                return;
            }

            this.bottom -= doodlerFallSpeed;
            this.visual.style.bottom = this.bottom + 'px';


            // evaluate collision with platform
            platforms.forEach(platform => {    
                if (this.bottom >= platform.bottom
                    && this.bottom <= platform.bottom + 15
                    && (this.left + 85) >= platform.left
                    && this.left <= (platform.left + 85)
                    && this.jumpTimer == null
                ) {
                    console.log(`landed on platform+ ${platform}`)
                    this.jumpingStartPoint = this.bottom;
                    this.jump()
                }
            })
        }.bind(this), 30);
    }
}

class Platform {
    constructor(parent, newPlaformBottom) {
        this.bottom = newPlaformBottom;
        this.left = Math.random() * 315
        this.visual = document.createElement('div')
        this.parent = parent
        
        this.visual.classList.add('platform')
        this.visual.style.left = this.left + 'px'
        this.visual.style.bottom = this.bottom + 'px'

        parent.appendChild(this.visual);
        this.startFalling()
    }

    startFalling() {
        this.fallTimer = setInterval(function () {
            // only move while doodler is above 200
            if (doodler.bottom <= 200) return
            this.bottom -= platformFallSpeed;
            this.visual.style.bottom = this.bottom + 'px';

            // destroy platform when falling through bottom
            if (this.bottom <= (0 - this.visual.style.height)) {
                platforms.shift()
                console.log(platforms)
                clearInterval(this.fallTimer)
                const newPlatform = new Platform(this.parent, 600)
                platforms.push(newPlatform)
            }
        }.bind(this), 30);
    }
}
