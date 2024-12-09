let columns;
let colours;


window.addEventListener('load', () => {
    colours = window.location.hash.slice(1).split('#')
    columns = document.querySelectorAll('.column')
    setRandomColor(colours)
})

document.addEventListener('click', (event) => {
    const et = event.target
    if (et.dataset.type === 'copy') {
        copyInClipboard(et.innerHTML)
    } else if (et.dataset.status === 'unlock') {
        lockAndUnlock(et, true)
    } else if (et.dataset.status === 'lock') {
        lockAndUnlock(et, false)
    } else if (et.dataset.type === 'reload') {
        setRandomColor([])
    }
})

document.addEventListener('wheel', (event) => {
    setRandomColor([])
})

function setRandomColor(colours) {
    let arrOfColurs = []
    let coloursIsEmpty = true
    if (colours.length === 4) {
        coloursIsEmpty = false
    }

    for (let i = 0; i < columns.length; i++) {
        const text = columns[i].querySelector('.column__text')
        const castle = columns[i].querySelector('.column__lock')

        if (castle.dataset.status === 'lock') {
            
            arrOfColurs.push(text.innerHTML)
            continue
        }
        
        const colour = coloursIsEmpty ? chroma.random() : `#${colours[i]}` 
        columns[i].style.backgroundColor = colour
        text.innerHTML = colour

        if (checkLuminance(colour)) {
            text.style.color = 'black'
            castle.querySelectorAll('svg')[0].style.fill = 'black'
            castle.querySelectorAll('svg')[1].style.fill = 'black'
        } else {
            text.style.color = 'white'
            castle.querySelectorAll('svg')[0].style.fill = 'white'
            castle.querySelectorAll('svg')[1].style.fill = 'white'
        }

        arrOfColurs.push(colour)   
    }

    setHash(arrOfColurs.join('').slice(1))
}

function copyInClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showModalWindow(true)
      }, function(err) {
        showModalWindow(false)
        console.error(err)
      });
}

function showModalWindow(success) {
    const sizes = getSizesOfWindow()
    const bottomGapOfModalWindow = 100
    const widthModalWindow = 300
    const heightModalWindow = 50
    const sizeOfFont = 21
    const modalWindow = document.createElement('div')
    const message = document.createElement('p')
    let backgroundColour = null;
    
    if (success) {
        message.innerHTML = 'Copy Successfully'
        backgroundColour = '#2bff60'
    } else {
        message.innerHTML = 'Copy Error'
        backgroundColour = '#ad5f6e'
    }

    message.style.cssText = `
        font-size: ${sizeOfFont}px;
        font-family: 'Space Grotesk';
        color: black;
        
    `
    modalWindow.style.cssText = `
        position: fixed;
        width: ${widthModalWindow}px;
        height: ${heightModalWindow}px;
        left: ${sizes[0] / 2 - widthModalWindow / 2}px;
        top: ${sizes[1] - heightModalWindow - bottomGapOfModalWindow}px;
        border: 2px solid black;
        border-radius: 8px;
        background-color: ${backgroundColour};
        box-shadow: 0px 1px 10px 1px;
        transition: all 1s;
        display: flex;
        justify-content: center;
    `
    modalWindow.append(message)
    document.body.append(modalWindow)

    hideModalWindow(modalWindow)
}

function hideModalWindow(modal) {
    setTimeout(() => {
        modal.style.opacity = 0
        setTimeout(() => {
            modal.remove()
        }, 1000)
    }, 1000)
    
    
}

function getSizesOfWindow() {
    const width = document.documentElement.clientWidth
    const height = document.documentElement.clientHeight

    return [width, height]
}

function lockAndUnlock(element, isUnlock) {
    let lock = element.querySelector('.lock')
    let unlock = element.querySelector('.unlock')
    if (isUnlock) {
        element.dataset.status = 'lock'
        lock.style.display = 'block'
        unlock.style.display = 'none'

    } else {
        element.dataset.status = 'unlock'
        lock.style.display = 'none'
        unlock.style.display = 'block'
    }
}


function checkLuminance(colour) {
    if (chroma(colour).luminance() > 0.5) {
        return true
    } else {
        return false
    }
}

function setHash(hash) {
    window.location.hash = hash;
}

function rgbToHex(r, g, b) {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`
} 
