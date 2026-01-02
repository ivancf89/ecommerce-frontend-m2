// ============================
// MyOwnCountry - main.js
// ============================

// 1) Productos
const products = [
  {
    id: "coucou-land",
    name: "CouCou Land",
    price: 37000000,
    currency: "USD",
    img: "ASSETS/IMG/CouCouLand.png",
    shortDesc: "Un país pacífico, ideal para comenzar tu imperio ficticio.",
    longDesc:
      "CouCou Land es perfecto si buscas tranquilidad, buena vibra y un territorio listo para que inventes tu historia. Ideal para quien compra su primer país ficticio."
  },
  {
    id: "orient-paradise-island",
    name: "Orient Paradise Island",
    price: 120000000,
    currency: "USD",
    img: "ASSETS/IMG/OrientParadiseIsland.png",
    shortDesc: "Isla exclusiva con paisajes únicos y lujo absoluto.",
    longDesc:
      "Orient Paradise Island es una isla premium: clima perfecto, lujo imaginario y vistas espectaculares. Ideal para un imperio tropical con estilo."
  }
];

// 2) Utilidades
function formatUSD(value) {
  return value.toLocaleString("es-CL");
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartBadge() {
  const badge = document.querySelector("#cartCount");
  if (!badge) return;
  const cart = getCart();
  const total = cart.reduce((acc, item) => acc + item.qty, 0);
  badge.textContent = total;
}

function addToCart(productId) {
  const cart = getCart();
  const item = cart.find((p) => p.id === productId);

  if (item) {
    item.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  showToast("Producto agregado al carrito");
}

// 3) Home
function renderHome() {
  const grid = document.querySelector("#productsGrid");
  if (!grid) return;

  grid.innerHTML = products
    .map(
      (p) => `
      <div class="col-12 col-md-6">
        <div class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.name}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.name}</h5>
            <p class="card-text">${p.shortDesc}</p>
            <p class="fw-bold mt-auto">${p.currency} $${formatUSD(p.price)}</p>
            <div class="d-flex gap-2">
              <a href="product.html?id=${p.id}" class="btn btn-primary">Ver más</a>
              <button class="btn btn-success" data-id="${p.id}">Agregar</button>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");

  grid.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset.id);
    });
  });
}

// 4) Detalle
function renderProductDetail() {
  const container = document.querySelector("#productDetail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const product = products.find((p) => p.id === id);

  if (!product) {
    container.innerHTML = `<div class="alert alert-danger">Producto no encontrado</div>`;
    return;
  }

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-12 col-lg-6">
        <img src="${product.img}" class="img-fluid rounded shadow-sm" alt="${product.name}">
      </div>
      <div class="col-12 col-lg-6">
        <h1 class="text-danger">${product.name}</h1>
        <p class="fs-5">${product.longDesc}</p>
        <p class="fw-bold fs-4">${product.currency} $${formatUSD(product.price)}</p>
        <button class="btn btn-success" id="addDetail">Agregar al carrito</button>
        <a href="index.html" class="btn btn-outline-secondary ms-2">Volver</a>
      </div>
    </div>
  `;

  document.querySelector("#addDetail").addEventListener("click", () => {
    addToCart(product.id);
  });
}

// 5) Carrito
function renderCart() {
  const container = document.querySelector("#cartView");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `<div class="alert alert-warning">Carrito vacío</div>`;
    return;
  }

  let total = 0;

  const rows = cart
    .map((item) => {
      const p = products.find((x) => x.id === item.id);
      const subtotal = p.price * item.qty;
      total += subtotal;

      return `
        <tr>
          <td>${p.name}</td>
          <td class="text-center">${item.qty}</td>
          <td class="text-end">${p.currency} $${formatUSD(subtotal)}</td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Producto</th>
          <th class="text-center">Cantidad</th>
          <th class="text-end">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <th colspan="2" class="text-end">Total</th>
          <th class="text-end">USD $${formatUSD(total)}</th>
        </tr>
      </tfoot>
    </table>
  `;
}

// 6) Toast simple
function showToast(message) {
  const toast = document.querySelector("#toastArea");
  if (!toast) return;

  toast.innerHTML = `<div class="alert alert-success">${message}</div>`;
  setTimeout(() => (toast.innerHTML = ""), 1200);
}

// 7) Init
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderHome();
  renderProductDetail();
  renderCart();
});
