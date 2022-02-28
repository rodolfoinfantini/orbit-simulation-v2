export function dialog(x, y, defaults = {}) {
    return new Promise((resolve, reject) => {
        const div = document.createElement('div')
        div.classList.add('dialog')

        const h1 = document.createElement('h1')
        h1.textContent = defaults.title || 'Edit Ball'

        const form = document.createElement('form')

        form.appendChild(h1)

        const staticLabel = document.createElement('label')
        staticLabel.textContent = 'Static'
        const staticInput = document.createElement('input')
        staticInput.type = 'checkbox'
        staticInput.checked = defaults.isStatic || false
        staticLabel.appendChild(staticInput)
        form.appendChild(staticLabel)

        //pos x
        const posXLabel = document.createElement('label')
        posXLabel.innerText = 'X'
        form.appendChild(posXLabel)
        const posXInput = document.createElement('input')
        posXInput.type = 'number'
        posXInput.value = defaults.posX ?? x
        form.appendChild(posXInput)

        //pos y
        const posYLabel = document.createElement('label')
        posYLabel.innerText = 'Y'
        form.appendChild(posYLabel)
        const posYInput = document.createElement('input')
        posYInput.type = 'number'
        posYInput.value = defaults.posY ?? y
        form.appendChild(posYInput)

        //vel x
        const velXLabel = document.createElement('label')
        velXLabel.innerText = 'Initial velocity X'
        form.appendChild(velXLabel)
        const velXInput = document.createElement('input')
        velXInput.type = 'number'
        velXInput.value = defaults.velX ?? 0
        velXInput.step = 0.1
        form.appendChild(velXInput)

        //vel y
        const velYLabel = document.createElement('label')
        velYLabel.innerText = 'Initial velocity Y'
        form.appendChild(velYLabel)
        const velYInput = document.createElement('input')
        velYInput.type = 'number'
        velYInput.value = defaults.velY ?? 0
        velYInput.step = 0.1
        form.appendChild(velYInput)

        //radius
        const radiusLabel = document.createElement('label')
        radiusLabel.innerText = 'Radius'
        form.appendChild(radiusLabel)
        const radiusInput = document.createElement('input')
        radiusInput.type = 'number'
        radiusInput.value = defaults.radius ?? 15
        form.appendChild(radiusInput)

        //mass
        const massLabel = document.createElement('label')
        massLabel.innerText = 'Mass (tons)'
        form.appendChild(massLabel)
        const massInput = document.createElement('input')
        massInput.type = 'number'
        massInput.value = defaults.mass ?? 5000
        massInput.step = 100
        form.appendChild(massInput)

        const button = document.createElement('button')
        button.innerText = 'Save'
        form.appendChild(button)

        const deleteButton = document.createElement('div')
        deleteButton.classList.add('delete')
        deleteButton.innerText = 'Delete ball'
        if (defaults.posX !== undefined) form.appendChild(deleteButton)
        deleteButton.onclick = () => {
            div.remove()
            resolve({
                delete: true,
            })
        }

        const cancelButton = document.createElement('div')
        cancelButton.classList.add('cancel')
        cancelButton.innerText = 'Cancel'
        form.appendChild(cancelButton)

        cancelButton.onclick = () => {
            div.remove()
            reject()
        }

        div.appendChild(form)

        form.onsubmit = (e) => {
            e.preventDefault()
            const values = {
                posX: +posXInput.value,
                posY: +posYInput.value,
                velX: +velXInput.value / 10,
                velY: +velYInput.value / 10,
                radius: +radiusInput.value,
                mass: +massInput.value * 1000,
                isStatic: staticInput.checked,
            }
            div.remove()
            resolve(values)
        }

        document.body.appendChild(div)
    })
}
