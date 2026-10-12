/** @format */
/* global menuData, basketTemplate */

let basket = [];
const deliveryFee = 4.99;

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
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0,
  );

  return {
    subtotal,
    deliveryFee,
    total: basket.length === 0 ? 0 : subtotal + deliveryFee,
  };
}

function updateBasket(itemId, action) {
  const item = findMenuItemById(itemId);

  if (!item) {
    return;
  }

  const existingEntry = basket.find((entry) => entry.item.id === itemId);

  if (action === "add" || action === "increase") {
    if (existingEntry) {
      existingEntry.quantity += 1;
    } else {
      basket.push({ item, quantity: 1 });
    }
  } else if (action === "decrease") {
    if (!existingEntry) {
      return;
    }

    existingEntry.quantity -= 1;

    if (existingEntry.quantity <= 0) {
      basket = basket.filter((entry) => entry.item.id !== itemId);
    }
  } else if (action === "remove") {
    basket = basket.filter((entry) => entry.item.id !== itemId);
  } else {
    return;
  }

  renderBasket();
}

function addToBasket(itemId) {
  updateBasket(itemId, "add");
}

function renderBasket() {
  const basketContent = document.getElementById("basket-content");
  const mobileBasketContent = document.getElementById("mobile-basket-content");
  const mobileBasketCount = document.getElementById("mobile-basket-count");

  const totalItems = basket.reduce((sum, entry) => sum + entry.quantity, 0);

  if (mobileBasketCount) {
    mobileBasketCount.textContent = String(totalItems);
  }

  const countButtons = document.querySelectorAll("[data-count-id]");
  countButtons.forEach((button) => {
    const itemId = Number(button.dataset.countId);
    const itemEntry = basket.find((entry) => entry.item.id === itemId);

    if (itemEntry && itemEntry.quantity > 0) {
      button.textContent = String(itemEntry.quantity);
      return;
    }

    button.textContent = "";
  });

  const { subtotal, deliveryFee: basketDeliveryFee, total } = getBasketSummary();
  const markup = basketTemplate(basket, subtotal, basketDeliveryFee, total);

  [basketContent, mobileBasketContent].filter(Boolean).forEach((element) => {
    element.innerHTML = markup;
  });
}

function showOrderConfirmation() {
  const modal = document.getElementById("order-confirmation-modal");
  if (!modal) {
    return;
  }

  modal.classList.add("visible");
}

function hideOrderConfirmation() {
  const modal = document.getElementById("order-confirmation-modal");
  if (!modal) {
    return;
  }

  modal.classList.remove("visible");
}

function confirmOrder() {
  if (basket.length === 0) {
    return;
  }

  basket = [];
  renderBasket();
  showOrderConfirmation();
}

function bindConfirmationModalEvents() {
  const modal = document.getElementById("order-confirmation-modal");
  if (!modal) {
    return;
  }

  const closeButton = modal.querySelector(".order-confirmation-close");
  if (closeButton) {
    closeButton.addEventListener("click", hideOrderConfirmation);
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      hideOrderConfirmation();
    }
  });
}

function openMobileBasket() {
  const dialog = document.getElementById("mobile-basket-dialog");

  if (!dialog) {
    return;
  }

  dialog.classList.add("visible");
  dialog.setAttribute("aria-hidden", "false");
}

function closeMobileBasket() {
  const dialog = document.getElementById("mobile-basket-dialog");

  if (!dialog) {
    return;
  }

  dialog.classList.remove("visible");
  dialog.setAttribute("aria-hidden", "true");
}

function handleBasketClick(event) {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton) {
    return;
  }

  const { action, id } = actionButton.dataset;

  if (action === "buy") {
    confirmOrder();
    closeMobileBasket();
    return;
  }

  updateBasket(Number(id), action);
}

function initBasket() {
  const basketContent = document.getElementById("basket-content");
  const mobileBasketContent = document.getElementById("mobile-basket-content");
  const mobileBasketToggle = document.getElementById("mobile-basket-toggle");
  const mobileBasketClose = document.querySelector(".mobile-basket-close");
  const mobileBasketDialog = document.getElementById("mobile-basket-dialog");

  if (!basketContent && !mobileBasketContent) {
    return;
  }

  bindConfirmationModalEvents();

  if (mobileBasketToggle) {
    mobileBasketToggle.addEventListener("click", openMobileBasket);
  }

  if (mobileBasketClose) {
    mobileBasketClose.addEventListener("click", closeMobileBasket);
  }

  if (mobileBasketDialog) {
    mobileBasketDialog.addEventListener("click", (event) => {
      if (event.target === mobileBasketDialog) {
        closeMobileBasket();
      }
    });
  }

  const basketContainers = [basketContent, mobileBasketContent].filter(Boolean);
  basketContainers.forEach((container) => {
    container.addEventListener("click", handleBasketClick);
  });

  renderBasket();
}
