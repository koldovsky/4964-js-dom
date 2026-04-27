import { products } from "./index.products-data.js";

const productsContainer = document.querySelector(".products__list");

function renderProductsList(products) {
  const productsHtmls = [];
  for (const product of products) {
    productsHtmls.push(`
        <article class="products__item">
            <img class="products__image" src="${product.image}" alt="${product.title}">
            <h3 class="products__name">${product.title}</h3>
            <p class="products__description">${product.description}</p>
            <div class="products__actions">
                <button class="products__button products__button--info button button-card">
                    Info
                </button>
                <button class="products__button products__button--buy button button-card">
                    $${product.price.toFixed(2)} Buy
                </button>
            </div>
        </article>
            `);
    }

    productsContainer.innerHTML = productsHtmls.join("");
}

if (productsContainer) {
    renderProductsList(products);
}