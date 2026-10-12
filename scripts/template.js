/** @format */

function formatPrice(price) {
  return price.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
  });
}

function categoryNavigationTemplate(category) {
  return `
    <button class="category-nav-button" type="button" data-target="category-${category.id}">
      ${category.category}
    </button>
  `;
}

function categoryHeaderTemplate(category) {
  const subtitle = category.subtitle
    ? `<span class="category-subtitle">${category.subtitle}</span>` : "";
  return `
    <header class="category-header-menu">
      <div class="category-inner">
        <img class="category-icon" src="${category.icon}" alt="" />
        <div class="category-title">
          <h2 id="category-title-${category.id}">${category.category} ${subtitle}</h2>
        </div>
      </div>
    </header>
  `;
}

function menuCategoryTemplate(category) {
  return `
    <section id="category-${category.id}" class="menu-category" aria-labelledby="category-title-${category.id}">
      ${categoryHeaderTemplate(category)}
      <div class="menu-items">
        ${category.items.map(menuItemTemplate).join("")}
      </div>
    </section>
  `;
}

function menuItemTemplate(item) {
  return `
    <article class="menu-item">
      <img class="menu-item-image" src="${item.image}" alt="${item.name}" />
      <div class="menu-item-details">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
      </div>
      ${menuItemActionTemplate(item)}
    </article>
  `;
}

function menuItemActionTemplate(item) {
  return `
    <div class="item-action-column">
      <span class="menu-item-price">${formatPrice(item.price)}</span>
      <button class="menu-item-button" type="button" data-add-id="${item.id}">
        <span>Add to basket</span>
        <span class="menu-item-count" data-count-id="${item.id}"></span>
      </button>
    </div>
  `;
}

function basketItemTemplate(entry) {
  return `
    <article class="basket-item">
      <div class="basket-item-top">
        <strong>${entry.quantity} × ${entry.item.name}</strong>
        <span>${formatPrice(entry.item.price * entry.quantity)}</span>
      </div>
      ${basketItemControlsTemplate(entry)}
    </article>
  `;
}

function basketQuantityButtonTemplate(entry, action, symbol, label) {
  return `
    <button class="quantity-button" type="button" data-action="${action}"
      data-id="${entry.item.id}" aria-label="${label}">${symbol}</button>
  `;
}

function basketItemControlsTemplate(entry) {
  return `
    <div class="basket-item-controls">
      ${basketQuantityButtonTemplate(entry, "decrease", "−", "Menge verringern")}
      <span class="quantity-value">${entry.quantity}</span>
      ${basketQuantityButtonTemplate(entry, "increase", "+", "Menge erhöhen")}
      <button class="remove-item" type="button" data-action="remove"
        data-id="${entry.item.id}" aria-label="${entry.item.name} entfernen"></button>
    </div>
  `;
}

function basketSummaryRowTemplate(label, price, className = "summary-row") {
  return `
    <div class="${className}">
      <span>${label}</span>
      <span>${formatPrice(price)}</span>
    </div>
  `;
}

function basketSummaryTemplate(subtotal, deliveryFee, total) {
  return `
    <div class="summary">
      ${basketSummaryRowTemplate("Subtotal", subtotal)}
      ${basketSummaryRowTemplate("Delivery fee", deliveryFee)}
      ${basketSummaryRowTemplate("Total", total, "total-row")}
      <button class="buy-button" type="button" data-action="buy">
        Buy now (${formatPrice(total)})
      </button>
    </div>
  `;
}

function basketTemplate(entries, subtotal, deliveryFee, total) {
  if (entries.length === 0) {
    return '<p class="empty">Dein Warenkorb ist leer.</p>';
  }
  return `
    <div class="items-list">${entries.map(basketItemTemplate).join("")}</div>
    ${basketSummaryTemplate(subtotal, deliveryFee, total)}
  `;
}
