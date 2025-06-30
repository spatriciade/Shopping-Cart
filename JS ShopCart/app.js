window.addEventListener("load", () => {
  const addedToCart = new bootstrap.Modal(document.querySelector("#addedToCart"));
  const cartPurchased = new bootstrap.Modal(document.querySelector("#cartPurchased"));
  const alreadyAddedToCart = new bootstrap.Modal(document.querySelector("#alreadyAddedToCart"));

  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
  addToCartButtons.forEach(button =>
    button.addEventListener("click", (e) => addToCartClicked(e))
  );

  const emptyCartBtn = document.querySelector("#empty-cart");
  if (emptyCartBtn) {
    emptyCartBtn.addEventListener("click", () => emptyCart());
  }

  const purchaseBtn = document.querySelector("#btn-purchase");
  if (purchaseBtn) {
    purchaseBtn.addEventListener("click", () => purchaseClicked());
  }

  const cartElement = document.querySelector("#cart");
  if (cartElement) {
    cartElement.addEventListener("click", () => {
      cartElement.classList.remove("hvr-pulse");
    });
  }

  const toggleShoppingControls = (enable) => {
    const emptyBtn = document.querySelector("#empty-cart");
    const purchaseBtn = document.querySelector("#btn-purchase");
    if (enable) {
      emptyBtn.classList.remove("disabled");
      purchaseBtn.classList.remove("disabled");
      purchaseBtn.classList.add("hvr-pulse");
    } else {
      emptyBtn.classList.add("disabled");
      purchaseBtn.classList.add("disabled");
      purchaseBtn.classList.remove("hvr-pulse");
    }
  };

  const emptyCart = () => {
    document.querySelector("tbody").innerHTML = "";
    updateCartTotal();
    toggleShoppingControls(false);
  };

  const purchaseClicked = () => {
    document.querySelector("tbody").innerHTML = "";
    updateCartTotal();
    toggleShoppingControls(false);
    cartPurchased.show();
    setTimeout(() => cartPurchased.hide(), 2000);
  };

  const removeCartItem = (event) => {
    const buttonClicked = event.target.closest("button[row-number]");
    const rowId = buttonClicked?.getAttribute("row-number");
    if (!rowId) return;
    document.querySelector(`#${rowId}`)?.remove();

    // Renumerar filas
    document.querySelectorAll("tbody tr").forEach((row, index) => {
      const th = row.querySelector("th[scope='row']");
      if (th) th.textContent = index + 1;
    });

    if (document.querySelectorAll("tbody tr").length === 0) {
      toggleShoppingControls(false);
    }

    updateCartTotal();
  };

  const addToCartClicked = (event) => {
    const button = event.target.closest(".add-to-cart-btn");
    const shopItem = button?.closest("[product-id]");
    if (!shopItem) return;

    const productId = shopItem.getAttribute("product-id");
    const title = shopItem.querySelector("img")?.alt || "";
    const productName = shopItem.querySelector(".card-footer h4")?.textContent.trim() || "";
    const price = shopItem.querySelector(".pricing-card-title")?.innerText.replace(" € / Kg", "") || "0";
    const imageSrc = shopItem.querySelector("img")?.src || "";

    addItemToCart(productId, title, productName, price, imageSrc);
    updateCartTotal();
  };

  const addItemToCart = (productId, title, productName, price, imageSrc) => {
    const rowId = "row-number-" + productId;

    if (document.querySelector(`#${rowId}`)) {
      alreadyAddedToCart.show();
      setTimeout(() => alreadyAddedToCart.hide(), 2500);
      return;
    }

    const itemsAdded = document.querySelectorAll("tbody tr").length + 1;
    const cartRow = document.createElement("tr");
    cartRow.setAttribute("id", rowId);
    cartRow.innerHTML = `
      <th scope="row">${itemsAdded}</th>
      <td>
        <div class="card border-success mb-3 text-center">
          <div class="card-body text-success">
            <img src="${imageSrc}" alt="${title}" class="img-thumbnail">
          </div>
          <div class="card-footer bg-transparent border-success">${productName}</div>
        </div>
      </td>
      <td>
        <h4 class="card-title pricing-card-title text-center">${price} € <small class="text-muted">/ Kg</small></h4>
      </td>
      <td>
        <div class="row">
          <div class="d-flex justify-content-center quantity col-12 col-md-6">
            <input class="form-control rounded-sm text-dark border-info" type="number" min="1" max="10" step="1" value="1" row-number="${rowId}">
            <div class="quantity-nav">
              <div class="quantity-button quantity-up border-info"><i class="fa-solid fa-circle-arrow-up text-warning"></i></div>
              <div class="quantity-button quantity-down border-info"><i class="fa-solid fa-circle-arrow-down text-warning"></i></div>
            </div>
          </div>
          <div class="text-center col-12 col-md-6">
            <button type="button" class="btn btn-link text-danger mt-2" row-number="${rowId}">
              <i class="fa-solid fa-circle-xmark"></i>
            </button>
          </div>
        </div>
      </td>
    `;

    cartRow.querySelector("button[row-number]")?.addEventListener("click", removeCartItem);
    const quantityInput = cartRow.querySelector("input[type='number']");
    if (quantityInput) {
      quantityInput.addEventListener("change", updateCartTotal);
      quantityInput.addEventListener("input", updateCartTotal);
    }

    const quantityUp = cartRow.querySelector(".quantity-up");
    const quantityDown = cartRow.querySelector(".quantity-down");

    if (quantityUp && quantityInput) {
      quantityUp.addEventListener("click", () => {
        const max = parseInt(quantityInput.max) || 10;
        if (parseInt(quantityInput.value) < max) {
          quantityInput.value = parseInt(quantityInput.value) + 1;
          updateCartTotal();
        }
      });
    }

    if (quantityDown && quantityInput) {
      quantityDown.addEventListener("click", () => {
        const min = parseInt(quantityInput.min) || 1;
        if (parseInt(quantityInput.value) > min) {
          quantityInput.value = parseInt(quantityInput.value) - 1;
          updateCartTotal();
        }
      });
    }

    document.querySelector("tbody").appendChild(cartRow);

    if (itemsAdded === 1) toggleShoppingControls(true);

    document.querySelector("#cart")?.classList.add("hvr-pulse");

    addedToCart.show();
    setTimeout(() => addedToCart.hide(), 1800);
  };

  const updateCartTotal = () => {
    let total = 0;
    document.querySelectorAll("tbody tr").forEach((row) => {
      const priceElement = row.querySelector(".pricing-card-title");
      const quantityInput = row.querySelector("input[type='number']");

      if (priceElement && quantityInput) {
        let price = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ""));
        let quantity = parseInt(quantityInput.value);
        const min = parseInt(quantityInput.min) || 1;
        const max = parseInt(quantityInput.max) || 10;

        if (isNaN(quantity) || quantity < min) {
          quantity = min;
          quantityInput.value = min;
        } else if (quantity > max) {
          quantity = max;
          quantityInput.value = max;
        }

        total += price * quantity;
      }
    });

    document.querySelector("#total-count").textContent = total.toFixed(2);
  };

  // Drag & Drop support
  let draggedItem = null;
  const listItems = document.querySelectorAll(".draggable");

  listItems.forEach(item => {
    item.addEventListener("dragstart", () => {
      draggedItem = item;
      item.style.opacity = "0.5";
    });

    item.addEventListener("dragend", () => {
      item.style.opacity = "1";
      draggedItem = null;
    });
  });

  if (cartElement) {
    cartElement.addEventListener("dragover", (e) => e.preventDefault());
    cartElement.addEventListener("dragenter", (e) => e.preventDefault());
    cartElement.addEventListener("drop", () => {
      if (!draggedItem) return;
      const productId = draggedItem.getAttribute("product-id");
      const title = draggedItem.querySelector("img")?.alt || "";
      const productName = draggedItem.querySelector(".card-footer h4")?.textContent || "";
      const price = draggedItem.querySelector(".pricing-card-title")?.innerText.replace(" € / Kg", "") || "0";
      const imageSrc = draggedItem.querySelector("img")?.src || "";

      addItemToCart(productId, title, productName, price, imageSrc);
      updateCartTotal();
    });
  }
});

