function showDeliveryInfo() {
    document.getElementById('delivery-info').style.display = 'block';
}

function cancelPurchase() {
    document.getElementById('delivery-info').style.display = 'none';
}

  const cartMenu = document.getElementById("cart-menu");
  const cartItemsElement = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const productsElement = document.getElementById("products");
  const checkoutModal = document.getElementById("checkout-modal");

  let cart = [];

  const products = [
    { name: "Kolakakor", price: 29, image: "kolakakor.jpeg" },
    { name: "Chokladbollar", price: 29, image: "chokladbollar.jpeg" },
    { name: "Pepparkakor", price: 19, image: "pepparkakor.jpeg" },
  ];

  function loadCart() {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
      updateCart();
    }
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function toggleCart(event) {
    if (event) event.preventDefault();
    cartMenu.classList.toggle("open");
  }

  function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCart();
    alert(`${productName} har lagts till i kundvagnen!`);
  }

  function updateCart() {
    cartItemsElement.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <span>${item.name} (x${item.quantity})</span>
        <span>${item.price * item.quantity} kr</span>
      `;
      cartItemsElement.appendChild(cartItem);
    });

    cartTotalElement.textContent = total;
    saveCart();
  }

  function clearCart() {
    cart = [];
    updateCart();
  }

  function openCheckout() {
    if (cart.length === 0) {
      alert("Din kundvagn är tom!");
      return;
    }
    checkoutModal.style.display = "flex";
  }

  function closeCheckout() {
    checkoutModal.style.display = "none";
  }

  function submitCheckout(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const postcode = document.getElementById("postcode").value;
    const city = document.getElementById("city").value;
    const email = document.getElementById("email").value;
    const tel = document.getElementById("tel").value;

    if (!cart.length) {
      alert("Din kundvagn är tom!");
      return;
    }

    if (!["702 31", "702 30", "702 29", "70231", "70230", "70229"].includes(postcode)) {
      alert ("Fel: error: Post");
      return;
    }

    let orderDetails = cart.map(item => `${item.name} (x${item.quantity}): ${item.price * item.quantity} kr`).join("\n");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("postcode", postcode);
    formData.append("city", city);
    formData.append("email", email);
    formData.append("tel", tel);
    formData.append("order", orderDetails);

    fetch("https://formspree.io/f/xldgbkej", {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    })
            .then(response => response.json())
            .then(data => {
              alert("Tack för din beställning! Vi har mottagit din order.");
              closeCheckout();
              clearCart();
            })
            .catch(error => {
              alert("Något gick fel. Vi skickar beställningen via e-post.");
              const subject = encodeURIComponent("Ny beställning från Fikastunden");
              const body = encodeURIComponent(`Namn: ${name}%0AAdress: ${address}%0APostnummer: ${postcode}%0AOrt: ${city}%0A%0AOrderdetaljer:%0A${orderDetails}`);
              window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;
            });
  }

  function renderProducts() {
    productsElement.innerHTML = products.map(product => `
      <div class="product">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price},00 kr</p>
        <button class="add-to-cart" onclick="addToCart('${product.name}', ${product.price})">Lägg till i kundvagnen</button>
      </div>
    `).join("");
  }

  window.addEventListener("load", () => {
    loadCart();
    renderProducts();
  });
