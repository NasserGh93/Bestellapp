/** @format */

let basket = [];
const deliveryFee = 4.99;

function findMenuItemById(itemId) {
  for (const category of menuData) {
    const item = category.items.find((menuItem) => menuItem.id === itemId);
    if (item) return item;
  }
  return null;
}

function addToBasket(itemId) {
  const item = findMenuItemById(itemId);
  if (!item) return;

  const existingEntry = basket.find((entry) => entry.item.id === itemId);

  if (existingEntry) {
    existingEntry.quantity++;
  } else {
    basket.push({ item: item, quantity: 1 });
  }

  renderBasket();
}

function increaseQuantity(itemId) {
  const entry = basket.find((basketEntry) => basketEntry.item.id === itemId);
  if (!entry) return;

  entry.quantity++;
  renderBasket();
}

function decreaseQuantity(itemId) {
  const entry = basket.find((basketEntry) => basketEntry.item.id === itemId);
  if (!entry) return;

  entry.quantity--;

  if (entry.quantity <= 0) {
    removeFromBasket(itemId);
    return;
  }

  renderBasket();
}

function removeFromBasket(itemId) {
  basket = basket.filter((entry) => entry.item.id !== itemId);
  renderBasket();
}

function calculateSubtotal() {
  return basket.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0,
  );
}

function calculateTotal() {
  if (basket.length === 0) return 0;
  return calculateSubtotal() + deliveryFee;
}

function renderBasket() {
  const basketContent = document.getElementById("basket-content");
  if (!basketContent) return;

  const subtotal = calculateSubtotal();
  const total = calculateTotal();

  basketContent.innerHTML = basketTemplate(
    basket,
    subtotal,
    basket.length > 0 ? deliveryFee : 0,
    total,
  );
}

function handleBasketClick(event) {
  const increaseButton = event.target.closest("[data-increase-id]");
  const decreaseButton = event.target.closest("[data-decrease-id]");
  const removeButton = event.target.closest("[data-remove-id]");

  if (increaseButton) {
    increaseQuantity(Number(increaseButton.dataset.increaseId));
    return;
  }

  if (decreaseButton) {
    decreaseQuantity(Number(decreaseButton.dataset.decreaseId));
    return;
  }

  if (removeButton) {
    removeFromBasket(Number(removeButton.dataset.removeId));
  }
}

function initBasket() {
  const basketContent = document.getElementById("basket-content");
  if (!basketContent) return;

  basketContent.addEventListener("click", handleBasketClick);
  renderBasket();
}
