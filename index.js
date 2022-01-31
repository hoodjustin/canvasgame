const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');
const levelEl = document.querySelector('#levelElement');
const levelUp = document.querySelector('#levelUp');
const nextLevelBtn = document.getElementById('nextlevelBtn');
const gameOver = document.querySelector('#gameOver');
const endScore = document.querySelector('#endScore');
const restartGame = document.querySelector('#restartGame');
const restartGameBtn = document.querySelector('#restartGameBtn');

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 10, 'white')

let level = 1;

let projectiles 
let enemies
let particles
let enemiesEliminated = 0
let keys = []
let interval;

function init() {
    console.log("init")
    player = new Player(x, y, 10, 'white')

    projectiles = [] 
    enemies = []
    particles = []
    scoreEl.innerHTML = score
    bigScoreEl.innerHTML = score
    levelEl.innerHTML = level
    clearInterval(interval);
}

function spawnEnemies() {
    console.log("spawnEnemies")
    interval = setInterval(() => {
        if(enemiesEliminated < level * 2) {
            const radius = (Math.random() * (30 - 4)) + 4;
            let x
            let y
            if(Math.random() < 0.5) {
                x =  Math.random() < 0.5 ? -radius : canvas.width + radius
                y = Math.random() * canvas.height
            } else {
                x =  Math.random() * canvas.width
                y =  Math.random() < 0.5 ? -radius : canvas.height + radius
            }
            const color = `hsl(${Math.random() * 360}, 50%, 50%)`
            const angle = Math.atan2(player.y - y, player.x - x)
            const velocity = {
                x: 1*Math.cos(angle),
                y: 1*Math.sin(angle)
            }
            enemies.push(new Enemy(x, y, radius, color, velocity))
        }
    }, 1000)
}

let animationId
let score = 0

function animate() {
    console.log("animate")
    levelEl.innerHTML = level
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgb(0,0,0)' //add a to make trail
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    
    particles.forEach((particle, index) => {
        if(particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    })
    projectiles.forEach((projectile, pindex) => {
        projectile.update();
        //remove from edges of screen
        if(projectile.x + projectile.radius < 0 || projectile.x - projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(pindex, 1)
            }, 0)
        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update(player.x, player.y);
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if(dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId)
            level = 1
            enemiesEliminated = 0
            gameOver.style.display = 'flex'
            endScore.innerText = score
            score = 0
        }

        projectiles.forEach((projectile, projIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if(dist - enemy.radius - projectile.radius < 1) {
                score += 100;
                scoreEl.innerHTML = score
                for(let i = 0; i < enemy.radius * 2; i++) {
                    particles.push(new Particle(projectile.x, projectile.y, Math.random() * 2, enemy.color, {x: (Math.random() - 0.5) * 6 * Math.random(), y: (Math.random() - 0.5) * 6 * Math.random()}))
                }
                if(enemy.radius - 10 > 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    }) 
                    setTimeout(() => {
                        projectiles.splice(projIndex, 1)
                    }, 0)
                } else {
                    score += 250;
                    scoreEl.innerHTML = score
                    setTimeout(() => {
                        enemies.splice(index, 1)
                        projectiles.splice(projIndex, 1)
                        enemiesEliminated++;
                    }, 0)
                }
            }
        })
    })
    if(enemiesEliminated === level * 2) {
        cancelAnimationFrame(animationId)
        level++;
        enemiesEliminated = 0
        levelUp.style.display = 'flex'

        window.setTimeout(() => {
            init()
            animate()
            spawnEnemies()    
            levelUp.style.display = 'none'
            //clearInterval(interval);
        }, 1000);
    }
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    };
    projectiles.push(new Projectile(
        player.x, player.y, 5, 'white', velocity
    ));
})

startGameBtn.addEventListener('click', ()=> {
    init()
    animate()
    spawnEnemies()
    modalEl.style.display = 'none'
    gameOver.style.display = 'none'
})

//nextLevelBtn.addEventListener('click', ()=> {
//    init()
//    animate()
//    spawnEnemies()    
//    levelUp.style.display = 'none'
//    clearInterval(interval);
//})

restartGameBtn.addEventListener('click', ()=> {
    init()
    animate()
    spawnEnemies()
    gameOver.style.display = 'none'
})

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});