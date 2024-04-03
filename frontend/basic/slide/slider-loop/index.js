let nextDOM = document.getElementById('next');
let prevDOM = document.getElementById('prev');

let carouselDOM = document.querySelector('.carousel');
let slideDOM = document.querySelector('.carousel .list');
let thumbnailDOM = document.querySelector('.carousel .thumbnail');
let thumbItemDOM = thumbnailDOM.querySelectorAll('.item');

let timeDelay = 1000;
let timeNextDelay = 10000;
let timeOut;

const autoNext = () => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
        nextDOM.click();
    }, timeNextDelay);
}

autoNext();

thumbnailDOM.appendChild(thumbItemDOM[0]);

prevDOM.addEventListener('click', () => {
    displaySlider('prev');
})

nextDOM.addEventListener('click', () => {
    displaySlider('next');
})

const displaySlider = (type) => {
    let slideItem = slideDOM.querySelectorAll('.carousel .list .item');
    let thumbnailItem = document.querySelectorAll('.carousel .thumbnail .item');

    if(type === 'next') {
        slideDOM.appendChild(slideItem[0]);
        thumbnailDOM.appendChild(thumbnailItem[0]);
        carouselDOM.classList.remove('prev');
        carouselDOM.classList.add('next');
    } else {
        let itemSlide = slideItem.length - 1;
        let itemThumbnail = thumbItemDOM.length - 1;

        slideDOM.prepend(slideItem[itemSlide]);
        thumbnailDOM.prepend(thumbnailItem[itemThumbnail]);
        carouselDOM.classList.remove('next');
        carouselDOM.classList.add('prev');
    }

    setTimeout(() => {
        carouselDOM.classList.remove('next', 'prev');
    }, timeDelay)

    autoNext();
}