/** @format */
/* global menuData, categoryNavigationTemplate, menuCategoryTemplate, addToBasket, initBasket */

// ========================================
// MENU RENDERING
// ========================================

function renderCategoryNavigation() {
  const nav = document.getElementById("category-nav");

  if (!nav) {
    return;
  }

  nav.innerHTML = menuData.map(categoryNavigationTemplate).join("");
}

function handleCategoryNavigationClick(event) {
  const navButton = event.target.closest("[data-target]");

  if (!navButton) {
    return;
  }

  const section = document.getElementById(navButton.dataset.target);
  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderMenu() {
  const menuContainer = document.getElementById("menu");

  if (!menuContainer) {
    return;
  }

  menuContainer.innerHTML = menuData.map(menuCategoryTemplate).join("");

  renderCategoryNavigation();
}

// ========================================
// MENU CLICK
// ========================================

function handleMenuClick(event) {
  const addButton = event.target.closest("[data-add-id]");

  if (!addButton) {
    return;
  }

  const itemId = Number(addButton.dataset.addId);

  addToBasket(itemId);
}

// ========================================
// MENU INIT
// ========================================

function initMenu() {
  const menuContainer = document.getElementById("menu");
  const categoryNav = document.getElementById("category-nav");
  if (!menuContainer) {
    return;
  }

  menuContainer.addEventListener("click", handleMenuClick);
  if (categoryNav) {
    categoryNav.addEventListener("click", handleCategoryNavigationClick);
  }

  renderMenu();
}

// ========================================
// APP INIT
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initBasket();
});
