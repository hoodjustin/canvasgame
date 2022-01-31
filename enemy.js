class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x
        this.y = y
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }

    setAngle(playerX, playerY) {
        const angle = Math.atan2(playerY - this.y, playerX - this.x)
        const velo = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        this.velocity = velo
    }

    update(playerX, playerY) {
        this.setAngle(playerX, playerY)
        this.draw()
        this.x = this.x + 2.5 * this.velocity.x,
        this.y = this.y + 2.5 * this.velocity.y

    }
}