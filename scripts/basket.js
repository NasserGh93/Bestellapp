/** @format */
/* global menuData, basketTemplate */

let basket = [];
const deliveryFee = 4.99;

function saveBasketToLocalStorage() {
  try {
    localStorage.setItem("burgerhouse_basket", JSON.stringify(basket));
  } catch (error) {
    console.warn("Der Warenkorb konnte nicht gespeichert werden.", error);
  }
}

function loadBasketFromLocalStorage() {
  try {
    const stored = localStorage.getItem("burgerhouse_basket");
    if (!stored) return;
    const entries = JSON.parse(stored);
    if (!Array.isArray(entries)) return;
    basket = entries.filter((entry) => entry && entry.item &&
      Number.isInteger(entry.quantity) && entry.quantity > 0 &&
      Number.isFinite(entry.item.price) && entry.item.price >= 0 &&
      findMenuItemById(entry.item.id));
  } catch (error) {
    console.warn("Der Warenkorb konnte nicht geladen werden.", error);
  }
}

function findMenuItemById(itemId) {
  for (const category of menuData) {
    const item = category.items.find((menuItem) => menuItem.id === itemId);
    if (item) {
      return item;
    }
  }
  return null;
}

function getBasketSummary() {
  const subtotal = basket.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity, 0,
  );
  return {
    subtotal,
    deliveryFee,
    total: basket.length === 0 ? 0 : subtotal + deliveryFee,
  };
}

function increaseBasketItem(item) {
  const entry = basket.find((entry) => entry.item.id === item.id);
  if (entry) {
    entry.quantity += 1;
  } else {
    basket.push({ item, quantity: 1 });
  }
}

function removeBasketItem(itemId) {
  basket = basket.filter((entry) => entry.item.id !== itemId);
}

function decreaseBasketItem(item) {
  const entry = basket.find((entry) => entry.item.id === item.id);
  if (!entry) {
    return;
  }
  entry.quantity -= 1;
  if (entry.quantity === 0) {
    removeBasketItem(item.id);
  }
}

function updateBasket(itemId, action) {
  const item = findMenuItemById(itemId);
  const actions = {
    add: increaseBasketItem,
    increase: increaseBasketItem,
    decrease: decreaseBasketItem,
    remove: (item) => removeBasketItem(item.id),
  };
  if (item && Object.hasOwn(actions, action)) {
    actions[action](item);
    saveBasketToLocalStorage();
    renderBasket();
  }
}

function addToBasket(itemId) {
  updateBasket(itemId, "add");
}

function getBasketContainers() {
  return [
    document.getElementById("basket-content"),
    document.getElementById("mobile-basket-content"),
  ].filter(Boolean);
}

function updateBasketCounts() {
  const count = document.getElementById("mobile-basket-count");
  if (count) {
    count.textContent = String(basket.reduce((sum, entry) => sum + entry.quantity, 0));
  }
  document.querySelectorAll("[data-count-id]").forEach(updateMenuItemCount);
}

function updateMenuItemCount(element) {
  const itemId = Number(element.dataset.countId);
  const entry = basket.find((entry) => entry.item.id === itemId);
  element.textContent = entry ? String(entry.quantity) : "";
}

function restoreBasketFocus(container, action, id) {
  const buttons = container.querySelectorAll("[data-action]");
  const matching = [...buttons].find((button) =>
    button.dataset.action === action && button.dataset.id === id,
  );
  const target = matching || buttons[0] || container.closest("dialog");
  if (target) {
    target.focus();
  }
}

function renderBasketContainer(container, markup) {
  const active = document.activeElement;
  const shouldRestore = container.contains(active);
  const { action, id } = active.dataset;
  container.innerHTML = markup;
  if (shouldRestore) {
    restoreBasketFocus(container, action, id);
  }
}

function renderBasket() {
  const { subtotal, deliveryFee, total } = getBasketSummary();
  const markup = basketTemplate(basket, subtotal, deliveryFee, total);
  getBasketContainers().forEach((container) => renderBasketContainer(container, markup));
  updateBasketCounts();
}

function openDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (!dialog || dialog.open) {
    return;
  }
  dialog.classList.add("visible");
  dialog.showModal();
  document.body.classList.add("dialog-open");
}

function closeDialog(dialogId) {
  const dialog = document.getElementById(dialogId);
  if (dialog && dialog.open) {
    dialog.close();
  }
}

function handleDialogClose(event) {
  event.target.classList.remove("visible");
  if (!document.querySelector("dialog[open]")) {
    document.body.classList.remove("dialog-open");
  }
}

function showOrderConfirmation() {
  openDialog("order-confirmation-modal");
}

function hideOrderConfirmation() {
  closeDialog("order-confirmation-modal");
}

function openMobileBasket() {
  openDialog("mobile-basket-dialog");
}

function closeMobileBasket() {
  closeDialog("mobile-basket-dialog");
}

function confirmOrder() {
  if (basket.length === 0) {
    return;
  }
  closeMobileBasket();
  basket = [];
  saveBasketToLocalStorage();
  renderBasket();
  showOrderConfirmation();
}

function bindDialogEvents(dialogId, closeHandler) {
  const dialog = document.getElementById(dialogId);
  if (!dialog) {
    return;
  }
  dialog.querySelector("[data-dialog-close]").addEventListener("click", closeHandler);
  dialog.addEventListener("close", handleDialogClose);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeHandler();
    }
  });
}

function handleBasketClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }
  const { action, id } = button.dataset;
  if (action === "buy") {
    confirmOrder();
  } else {
    updateBasket(Number(id), action);
  }
}

function bindMobileBasketEvents() {
  const toggle = document.getElementById("mobile-basket-toggle");
  if (toggle) {
    toggle.addEventListener("click", openMobileBasket);
  }
  bindDialogEvents("mobile-basket-dialog", closeMobileBasket);
  bindDialogEvents("order-confirmation-modal", hideOrderConfirmation);
}

function initBasket() {
  loadBasketFromLocalStorage();
  getBasketContainers().forEach((container) => {
    container.addEventListener("click", handleBasketClick);
  });
  bindMobileBasketEvents();
  renderBasket();
}
