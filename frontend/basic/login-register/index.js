const btn_login = document.querySelector('#login_btn');
const btn_register = document.querySelector('#register_btn');

const btn_login_2 = document.querySelector('#login_btn_2');
const btn_register_2 = document.querySelector('#register_btn_2');

const container = document.querySelector('.container');

btn_register.addEventListener('click', () => {
    container.classList.add('register_mode');
});

btn_login.addEventListener('click', () => {
    container.classList.remove('register_mode');
});

btn_register_2.addEventListener('click', () => {
    container.classList.add('register_mode_2');
});

btn_login_2.addEventListener('click', () => {
    container.classList.remove('register_mode_2');
});