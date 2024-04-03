let list = document.querySelector('.slider .list');
let items = document.querySelectorAll('.slider .list .item');
let dots = document.querySelectorAll('.slider .dots li');

let prev = document.getElementById('prev');
let next = document.getElementById('next');

let activeItem = 0;
let itemLength = items.length - 1;

next.addEventListener('click', () => {
    if (activeItem + 1 > itemLength) {
        activeItem = 0;
    } else {
        activeItem++;
    }
    reloadSlider();
})

prev.addEventListener('click', () => {
    if (activeItem - 1 < 0) {
        activeItem = itemLength;
    } else {
        activeItem--;
    }
    reloadSlider();
})

let refreshSlider = setInterval(() => {next.click()}, 3000);

const reloadSlider = () => {
    let checkLeft = items[activeItem].offsetLeft;
    list.style.left = -checkLeft + 'px';

    let lastActiveDot = document.querySelector('.slider .dots li.active');
    lastActiveDot.classList.remove('active');
    dots[activeItem].classList.add('active');
    clearInterval(refreshSlider);
    refreshSlider = setInterval(() => {next.click()}, 3000);
}

dots.forEach((li, key) => {
    li.addEventListener('click', () => {
        activeItem = key;
        reloadSlider();
    })
})