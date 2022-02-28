const G = 6.67 * Math.pow(10, -11)

export default class Ball {
    history = []

    initialPos = {
        x: 0,
        y: 0,
    }
    initialVelocity = {
        x: 0,
        y: 0,
    }

    pos = {
        x: 0,
        y: 0,
    }
    velocity = {
        x: 0,
        y: 0,
    }
    radius = 15
    color = '#fff'
    mass

    isStatic = false

    reset(ctx) {
        this.history = []
        this.pos.x = this.initialPos.x
        this.pos.y = this.initialPos.y
        this.velocity.x = this.initialVelocity.x
        this.velocity.y = this.initialVelocity.y
        this.draw(ctx)
    }

    constructor(x = 0, y = 0, vx = 0, vy = 0, mass = 5000000, radius = 15, isStatic = false) {
        this.initialPos.x = x
        this.initialPos.y = y
        this.pos.x = x
        this.pos.y = y
        this.initialVelocity.x = vx
        this.initialVelocity.y = vy
        this.velocity.x = vx
        this.velocity.y = vy
        this.color = randomColor()
        this.mass = mass
        this.radius = radius
        this.isStatic = isStatic
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.strokeStyle = '#ccc'
        for (const point of this.history) ctx.lineTo(point.x, point.y)
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fill()
        ctx.lineWidth = 2
        ctx.stroke()
    }

    update(ctx, balls) {
        for (const ball of balls)
            if (this !== ball) ball.applyForce(this.calculateForce(ball), this)

        this.draw(ctx)
    }

    distance(ball) {
        const d = Math.sqrt(
            Math.pow(this.pos.x - ball.pos.x, 2) + Math.pow(this.pos.y - ball.pos.y, 2)
        )
        return d
    }

    calculateForce(ball) {
        return G * ((this.mass * ball.mass) / Math.pow(this.distance(ball), 2))
    }

    applyForce(force, ball) {
        if (this.isStatic) return
        // if (force === Infinity) return
        this.history.push({
            x: this.pos.x,
            y: this.pos.y,
        })
        const direction = {
            x: ball.pos.x - this.pos.x,
            y: ball.pos.y - this.pos.y,
        }
        const normalized = normalize(direction)
        this.velocity.x += force * normalized.x
        this.velocity.y += force * normalized.y
        this.pos.x += this.velocity.x
        this.pos.y += this.velocity.y
    }
}

function normalize(vector) {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y)
    return {
        x: vector.x / length,
        y: vector.y / length,
    }
}

function randomColor() {
    return `hsla(${Math.random() * 360}, 100%, 50%, 0.6)`
}
