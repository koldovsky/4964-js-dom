const headerNav = document.querySelector(".header__nav");
const burgerButton = document.querySelector(".header__burger");
const headerMenu = document.querySelector(".header__menu");

const closeMenu = () => {
    headerNav.classList.remove("header__nav--open");
    headerMenu.classList.remove("header__menu--open");
    burgerButton.setAttribute("aria-expanded", "false");
    burgerButton.setAttribute("aria-label", "Open navigation menu");
};

const openMenu = () => {
    headerNav.classList.add("header__nav--open");
    headerMenu.classList.add("header__menu--open");
    burgerButton.setAttribute("aria-expanded", "true");
    burgerButton.setAttribute("aria-label", "Close navigation menu");
};

burgerButton.addEventListener("click", () => {
    const isOpen = burgerButton.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

headerMenu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement && window.innerWidth < 600) {
        closeMenu();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 600) {
        closeMenu();
    }
});
