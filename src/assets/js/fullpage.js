function toScreen(screen = 0) {
    const screensWrapper = document.getElementById("screens-wrapper")
    // console.log(screensWrapper)
    if (screensWrapper) {
        screensWrapper.style.transform = `translateY(-${screen * window.innerHeight}px)`
    }
}

const toMainBtn = document.querySelectorAll(".js-to-main")
const toNavsBtn = document.querySelectorAll(".js-to-navigation")

for (const toMainBtnElement of toMainBtn) {
    console.log(toMainBtnElement)
    toMainBtnElement.addEventListener("click", function (e) {
        e.preventDefault()
        // console.log(e)
        toScreen()
    })
}

for (const toNavsBtnElement of toNavsBtn) {
    toNavsBtnElement.addEventListener("click", function (e) {
        e.preventDefault()
        // console.log(e)
        toScreen(1)
    })
}