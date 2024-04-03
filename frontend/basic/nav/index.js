const btn_toggle = document.querySelector('.toggle_btn');
const toggleIcon = document.querySelector('.toggle_btn i');
const dropdown_menu = document.querySelector('.drop_down');

btn_toggle.addEventListener('click', () => {
    dropdown_menu.classList.toggle('open');
    const isOpen = dropdown_menu.classList.contains('open');
    toggleIcon.classList = isOpen ? 'fa-solid fa-xmark':'fa-solid fa-bars'
});