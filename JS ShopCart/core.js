const GenerateContent = class {
  // Productos
  fruits = {
    1: ["1", "grapes", "Uvas", 4.95],
    2: ["2", "kiwis", "Kiwis", 3.85],
    3: ["3", "grapefruits", "Pomelos", 2.95],
    4: ["4", "cherries", "Cerezas", 3.55],
  };

  // Insertar año en el footer
  getYear = () => {
    const year = new Date().getFullYear();
    document.querySelector(".date").textContent += year;
  };

  // Formato HTML de un producto
  getProductCard = (id, imgName, displayName, price, label) => {
    return `
      <div class="draggable card mb-4 shadow-sm" draggable="true" product-id="${id}">
        <img
          src="./IMG/${imgName}.avif"
          class="card-img-top"
          alt="${displayName}"
          draggable="false"
        />
        <div class="card-body">
          <h1 class="card-title pricing-card-title">
            ${price} € <small class="text-muted">/Kg</small>
          </h1>
          <div class="d-grid gap-2">
            <button type="button" class="btn btn-warning btn-lg btn-block add-to-cart-btn">
              Add to cart
            </button>
          </div>
        </div>
        <div class="card-footer bg-info text-white">
          <h4 class="my-0 font-weight-normal">${label}</h4>
        </div>
      </div>
    `;
  };

  htmlToElement = (html) => {
    const template = document.createElement("template");
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstElementChild;
  };

  setPageContent = (fruits) => {
    const container = document.querySelector("#products-list");
    if (!container) {
      console.error('Element with id "products-list" not found.');
      return;
    }

    for (const key in fruits) {
      const [id, imgName, displayName, price] = fruits[key];
      const cardHTML = this.getProductCard(id, imgName, displayName, price, displayName);
      container.appendChild(this.htmlToElement(cardHTML));
    }
  };
};

// Ejecutar contenido dinámico
const obj = new GenerateContent();
obj.getYear();
obj.setPageContent(obj.fruits);
