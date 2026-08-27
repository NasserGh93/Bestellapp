/** @format */

// ========================================
// MENU RENDERING
// ========================================

function renderMenu() {
  const menuContainer = document.getElementById("menu");

  if (!menuContainer) {
    return;
  }

  menuContainer.innerHTML = menuData
    .map((category) => {
      return `
        ${categoryHeaderTemplate(category)}
        ${menuCategoryTemplate(category)}
      `;
    })
    .join("");
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

  if (!menuContainer) {
    return;
  }

  menuContainer.addEventListener("click", handleMenuClick);

  renderMenu();
}

// ========================================
// APP INIT
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initBasket();
});
