import { products } from "./index.products-data.js";

const carouselSection = document.querySelector(".products-carousel");

if (carouselSection) {
  const viewport = carouselSection.querySelector(".products-carousel__viewport");
  const track = carouselSection.querySelector(".products-carousel__track");
  const previousButton = carouselSection.querySelector(
    ".products-carousel__control--prev"
  );
  const nextButton = carouselSection.querySelector(
    ".products-carousel__control--next"
  );
  const indicatorsContainer = carouselSection.querySelector(
    ".products-carousel__indicators"
  );
  const autoplayDelay = 4000;

  let visibleCards = getVisibleCards();
  let currentIndex = visibleCards;
  let autoplayTimer = null;
  let resizeFrame = null;
  let slides = [];
  let isTransitioning = false;

  function getVisibleCards() {
    if (window.innerWidth >= 1024) {
      return 3;
    }

    if (window.innerWidth >= 768) {
      return 2;
    }

    return 1;
  }

  function renderSlide(product, logicalIndex, isClone = false) {
    return `
      <article
        class="products-carousel__slide"
        data-logical-index="${logicalIndex}"
        data-clone="${isClone}"
        aria-hidden="${isClone}"
      >
        <div class="products-carousel__card">
          <img class="products-carousel__image" src="${product.image}" alt="${product.title}">
          <div class="products-carousel__meta">
            <h3 class="products-carousel__name">${product.title}</h3>
            <p class="products-carousel__price">$${product.price.toFixed(2)}</p>
          </div>
          <p class="products-carousel__description">${product.description}</p>
          <div class="products-carousel__actions">
            <button class="button" type="button">Info</button>
            <button class="button" type="button">Buy now</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderIndicators() {
    indicatorsContainer.innerHTML = products
      .map(
        (product, index) => `
          <button
            class="products-carousel__indicator"
            type="button"
            data-index="${index}"
            aria-label="Show ${product.title}"
          ></button>
        `
      )
      .join("");
  }

  function createSlides() {
    const beforeClones = products.slice(-visibleCards);
    const afterClones = products.slice(0, visibleCards);
    const markup = [
      ...beforeClones.map((product, index) =>
        renderSlide(product, products.length - visibleCards + index, true)
      ),
      ...products.map((product, index) => renderSlide(product, index)),
      ...afterClones.map((product, index) => renderSlide(product, index, true)),
    ].join("");

    track.innerHTML = markup;
    slides = [...track.querySelectorAll(".products-carousel__slide")];
  }

  function getLogicalIndex() {
    const currentSlide = slides[currentIndex];

    if (!currentSlide) {
      return 0;
    }

    return Number(currentSlide.dataset.logicalIndex);
  }

  function updateIndicators() {
    const logicalIndex = getLogicalIndex();
    const indicators = indicatorsContainer.querySelectorAll(
      ".products-carousel__indicator"
    );

    indicators.forEach((indicator, index) => {
      const isActive = index === logicalIndex;

      indicator.classList.toggle("products-carousel__indicator--active", isActive);
      indicator.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function setTrackPosition(shouldAnimate = true) {
    const targetSlide = slides[currentIndex];

    if (!targetSlide) {
      return;
    }

    track.style.transition = shouldAnimate ? "transform 0.45s ease" : "none";
    track.style.transform = `translateX(-${targetSlide.offsetLeft}px)`;

    if (!shouldAnimate) {
      requestAnimationFrame(() => {
        track.style.transition = "transform 0.45s ease";
      });
    }

    updateIndicators();
  }

  function moveTo(index, shouldAnimate = true) {
    if (isTransitioning && shouldAnimate) {
      return;
    }

    currentIndex = index;
    isTransitioning = shouldAnimate;
    setTrackPosition(shouldAnimate);
  }

  function moveNext() {
    moveTo(currentIndex + 1);
  }

  function movePrevious() {
    moveTo(currentIndex - 1);
  }

  function stopAutoplay() {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    stopAutoplay();

    autoplayTimer = window.setInterval(() => {
      moveNext();
    }, autoplayDelay);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  function rebuildCarousel() {
    const logicalIndex = getLogicalIndex();

    visibleCards = getVisibleCards();
    createSlides();
    currentIndex = logicalIndex + visibleCards;
    setTrackPosition(false);
  }

  function handleTransitionEnd(event) {
    if (event.target !== track || event.propertyName !== "transform") {
      return;
    }

    if (currentIndex >= products.length + visibleCards) {
      currentIndex -= products.length;
      setTrackPosition(false);
    }

    if (currentIndex < visibleCards) {
      currentIndex += products.length;
      setTrackPosition(false);
    }

    isTransitioning = false;
    updateIndicators();
  }

  function handleResize() {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = null;

      if (visibleCards !== getVisibleCards()) {
        rebuildCarousel();
        return;
      }

      setTrackPosition(false);
    });
  }

  function bindEvents() {
    previousButton.addEventListener("click", () => {
      movePrevious();
      restartAutoplay();
    });

    nextButton.addEventListener("click", () => {
      moveNext();
      restartAutoplay();
    });

    indicatorsContainer.addEventListener("click", (event) => {
      const indicator = event.target.closest(".products-carousel__indicator");

      if (!indicator) {
        return;
      }

      moveTo(Number(indicator.dataset.index) + visibleCards);
      restartAutoplay();
    });

    track.addEventListener("transitionend", handleTransitionEnd);
    window.addEventListener("resize", handleResize);
    carouselSection.addEventListener("mouseenter", stopAutoplay);
    carouselSection.addEventListener("mouseleave", startAutoplay);
    carouselSection.addEventListener("focusin", stopAutoplay);
    carouselSection.addEventListener("focusout", startAutoplay);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoplay();
        return;
      }

      startAutoplay();
    });
  }

  renderIndicators();
  createSlides();
  setTrackPosition(false);
  bindEvents();
  startAutoplay();
}