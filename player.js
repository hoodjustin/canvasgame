class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
        if (keys[38] || keys[87]) {
            player.y -= 3;
        }        
        if (keys[40] || keys[83]) {
            player.y += 3
        }
        if (keys[39] || keys[68]) {
            player.x += 3
        }
        if (keys[37] || keys[65]) {
            player.x -= 3
        }
    }
}
