'use strict'
import Ball from './ball.js'
import { dialog } from './dialog.js'

let running = false

const h1 = document.querySelector('body > h1')

const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const ctx = canvas.getContext('2d')
document.body.appendChild(canvas)

const balls = []

let draggingBall

let open = true

canvas.onmousemove = ({ clientX, clientY }) => {
    if (running) return
    if (draggingBall) {
        open = false
        draggingBall.pos.x = clientX
        draggingBall.pos.y = clientY
        draggingBall.initialPos.x = clientX
        draggingBall.initialPos.y = clientY
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const ball of balls) ball.draw(ctx)
    }
}

canvas.onmousedown = ({ clientX, clientY }) => {
    if (running) return
    const ball = clickedOnABall(clientX, clientY)
    if (ball) {
        draggingBall = ball
    }
}
canvas.onmouseup = () => {
    draggingBall = null
}

canvas.onclick = async ({ clientX, clientY }) => {
    if (running) return
    const ball = clickedOnABall(clientX, clientY)
    if (ball) {
        if (!open) return (open = true)
        try {
            const defaults = {
                title: 'Edit Ball',
                posX: ball.pos.x,
                posY: ball.pos.y,
                velX: ball.initialVelocity.x * 10,
                velY: ball.initialVelocity.y * 10,
                radius: ball.radius,
                mass: ball.mass / 1000,
                isStatic: ball.isStatic,
            }
            const results = await dialog(clientX, clientY, defaults)
            const index = balls.indexOf(ball)
            if (results.delete) {
                balls.splice(index, 1)
                if (balls.length === 0) h1.style = ''
            } else {
                balls[index].pos.x = results.posX
                balls[index].pos.y = results.posY
                balls[index].velocity.x = results.velX
                balls[index].velocity.y = results.velY
                balls[index].initialVelocity.x = results.velX
                balls[index].initialVelocity.y = results.velY
                balls[index].radius = results.radius
                balls[index].mass = results.mass
                balls[index].isStatic = results.isStatic
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (const ball of balls) ball.draw(ctx)
        } catch (error) {
            // console.error(e)
        }
    } else {
        try {
            const results = await dialog(clientX, clientY, { title: 'Add Ball' })
            const ball = new Ball(
                results.posX,
                results.posY,
                results.velX,
                results.velY,
                results.mass,
                results.radius,
                results.isStatic
            )
            ball.draw(ctx)
            balls.push(ball)
            h1.style.display = 'none'
        } catch (e) {
            // console.error(e)
        }
    }
}

function clickedOnABall(x, y) {
    for (const ball of balls) {
        if (
            ball.pos.x + ball.radius > x &&
            ball.pos.x - ball.radius < x &&
            ball.pos.y + ball.radius > y &&
            ball.pos.y - ball.radius < y
        )
            return ball
    }
    return null
}

function loop() {
    if (!running) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (const ball of balls) ball.update(ctx, balls)
    requestAnimationFrame(loop)
}
// loop()

const runButton = document.querySelector('button.run')
runButton.onclick = () => {
    if (balls.length < 2) {
        return alert('You need at least 2 balls to run the simulation')
    }
    if (running) {
        running = false
        runButton.innerText = 'Run'
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (const ball of balls) {
            ball.reset(ctx)
        }
        return
    }
    runButton.textContent = 'Stop'
    running = true
    loop()
}
