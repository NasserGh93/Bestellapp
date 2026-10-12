/** @format */

// ========================================
// PRICE
// ========================================

function formatPrice(price) {
  return price.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

// ========================================
// CATEGORY HEADER
// ========================================

function categoryHeaderTemplate(category) {
  const subtitle = category.subtitle
    ? `<span class="category-subtitle">${category.subtitle}</span>`
    : "";

  return `
    <header class="category-header-menu">
      <div class="category-inner">

        <img
          class="category-icon"
          src="${category.icon}"
          alt=""
        />

        <div class="category-title">
          <h2>
            ${category.category}
            ${subtitle}
          </h2>
        </div>

      </div>
    </header>
  `;
}

// ========================================
// MENU CATEGORY
// ========================================

function menuCategoryTemplate(category) {
  return `
    <section
      id="category-${category.id}"
      class="menu-category"
    >

      <div class="menu-items">
        ${category.items.map(menuItemTemplate).join("")}
      </div>

    </section>
  `;
}

// ========================================
// MENU ITEM
// ========================================

function menuItemTemplate(item) {
  return `
    <article class="menu-item">

      <img
        class="menu-item-image"
        src="${item.image}"
        alt="${item.name}"
      />

      <div class="menu-item-details">

        <h3>
          ${item.name}
        </h3>

        <p>
          ${item.description}
        </p>

      </div>

      <div class="item-action-column">

        <span class="menu-item-price">
          ${formatPrice(item.price)}
        </span>

        <button
          class="menu-item-button"
          type="button"
          data-add-id="${item.id}"
        >
          <span>Add to basket</span>
          <span class="menu-item-count" data-count-id="${item.id}"></span>
        </button>

      </div>

    </article>
  `;
}

// ========================================
// BASKET ITEM
// ========================================

function basketItemTemplate(entry) {
  const itemTotal = entry.item.price * entry.quantity;

  return `
    <article class="basket-item">

      <div class="basket-item-top">

        <strong>
          ${entry.quantity} × ${entry.item.name}
        </strong>

        <span>
          ${formatPrice(itemTotal)}
        </span>

      </div>

      <div class="basket-item-controls">

        <button
          class="quantity-button"
          type="button"
          data-action="decrease"
          data-id="${entry.item.id}"
          aria-label="Menge verringern"
        >
          −
        </button>

        <span class="quantity-value">
          ${entry.quantity}
        </span>

        <button
          class="quantity-button"
          type="button"
          data-action="increase"
          data-id="${entry.item.id}"
          aria-label="Menge erhöhen"
        >
          +
        </button>

        <button
          class="remove-item"
          type="button"
          data-action="remove"
          data-id="${entry.item.id}"
          aria-label="${entry.item.name} entfernen"
        ></button>

      </div>

    </article>
  `;
}

// ========================================
// BASKET
// ========================================

function basketTemplate(entries, subtotal, deliveryFee, total) {
  if (entries.length === 0) {
    return `
      <p class="empty">
        Dein Warenkorb ist leer.
      </p>
    `;
  }

  return `
    <div class="items-list">
      ${entries.map(basketItemTemplate).join("")}
    </div>

    <div class="summary">

      <div class="summary-row">
        <span>Subtotal</span>
        <span>${formatPrice(subtotal)}</span>
      </div>

      <div class="summary-row">
        <span>Delivery fee</span>
        <span>${formatPrice(deliveryFee)}</span>
      </div>

      <div class="total-row">
        <span>Total</span>
        <span>${formatPrice(total)}</span>
      </div>

      <button
        class="buy-button"
        type="button"
        data-action="buy"
      >
        Buy now (${formatPrice(total)})
      </button>

    </div>
  `;
}
