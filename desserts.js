const displayArea = document.querySelector(".dessert-container");
const cartBox = document.querySelector(".cart-container");
const itemCount = document.querySelector(".items-count");
const confirmButton = document.querySelector(".confirm");
const totalAmount = document.querySelector(".total");
const modalx = document.querySelector(".confirmed-order");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const restartButton = document.querySelector(".restart");
const checkOutTotal = document.querySelector(".checkout-total");

let dessertsArray = [];
async function fetchLocalData() {
  try {
    const response = await fetch("./data.json");
    const data = await response.json();
    console.log(data);
    dessertsArray = data;
    // console.log(dessertsArray);
    renderDisplay(dessertsArray);
    renderCart(cart);
    // dessertsArray.forEach((dessert) => {});
  } catch (error) {
    console.error("Error;", error);
  }
}

fetchLocalData();

function renderDisplay(dessertsMenu) {
  displayArea.innerHTML = "";
  console.log(cart);
  dessertsMenu.forEach((dessert, index) => {
    const isInCart = cart.filter(
      (item) => item.name === dessertsMenu[index].name,
    );
    // console.log(isInCart);

    displayArea.innerHTML += `<div class="each-card">
    <img class="dessertIMG ${isInCart.length > 0 ? "selected" : ""}"src="${dessertsMenu[index].image.desktop}">
    ${
      isInCart.length > 0
        ? `
        <button style="background-color:hsl(14, 86%, 42%)" class="cart-btn cbtn" data-index="${index}">
        <img class='cart-imgi' data-action="minus" src="./assets/images/icon-decrement-quantity.svg" alt=""> 
          ${isInCart[0].quantity}
        <img class="cart-imgi plus" data-action="plus" src="./assets/images/icon-increment-quantity.svg" alt=""> 

      </button>
      `
        : `<button class="cart-btn"onclick="addToCart(${index})" >
        <img class='cart-img' src="./assets/images/icon-add-to-cart.svg" alt=""> 
        Add to Cart 
      </button>`
    }
    <div class="card-details">
    <p>${dessertsMenu[index].category}</p>
    <h3>${dessertsMenu[index].name}</h3>
    <p class='price'>$${dessertsMenu[index].price.toFixed(2)}</p>
    </div>
    </div>`;
  });
}

const cart = JSON.parse(localStorage.getItem("cartValue")) || [];
let count = 0;
let totalPrice = 0;

displayArea.addEventListener("click", (e) => {
  const action = e.target.dataset.action;
  console.log("Target;", e.target);
  // console.log("parent;", e.target.parentElement);
  if (!action) return;

  const button = e.target.closest(".cart-btn");
  // console.log("Closest:", button);
  // // console.log("button;", button);
  const index = button.dataset.index;
  // console.log("index;", index);

  if (action === "plus") {
    increment(Number(index));
  }
  if (action === "minus") decrement(Number(index));
});

// plusButton.addEventListener("click", increment(index));

function addToCart(index) {
  //
  const dessert = dessertsArray[index];
  const doesExist = cart.find((item) => {
    return item.name === dessert.name;
  });
  if (doesExist) {
    doesExist.quantity = 1;
  } else {
    cart.push({ ...dessert, quantity: 1 });
  }
  saveCart();
  renderCart(cart);
}

function saveCart() {
  localStorage.setItem("cartValue", JSON.stringify(cart));
}
function increment(index) {
  const dessert1 = dessertsArray[index];
  const doesExist1 = cart.find((item) => {
    return item.name === dessert1.name;
  });
  if (doesExist1) {
    doesExist1.quantity++;
    saveCart();
    renderCart(cart);
    console.log(
      "CALLED WITH INDEX;",
      index,
      "NEW QUANTITY;",
      doesExist1.quantity,
    );
  }
}

function decrement(index) {
  const dessert1 = dessertsArray[index];

  const doesExist1 = cart.find((item) => {
    return item.name === dessert1.name;
  });

  if (!doesExist1) return;

  doesExist1.quantity--;

  if (doesExist1.quantity <= 0) {
    const deleteI = cart.findIndex((desserts) => {
      return desserts.name === doesExist1.name;
    });

    cart.splice(deleteI, 1);
  }

  saveCart();
  renderCart(cart);
}
function openModal() {
  modalx.innerHTML = "";
  cart.forEach((item, index) => {
    modalx.innerHTML += `
    <div class="confirm-cards">
     <div>
     <img class="confirmIMG" src="${item.image.desktop}">
     </div>
     <div>
      <p>${item.name}</p>
       <div class="confrm-details" >
         <p class="quanti">x${item.quantity}</p>
         <p>$${item.price.toFixed(2)}</p>
       </div>
       </div>
       <div>
       <p class="confirmed-price">$${(item.price * item.quantity).toFixed(2)}</p>
       </div>
      
    </div>`;
  });
  const amountTotal = cart.reduce((totalPrice, item) => {
    return totalPrice + item.price * item.quantity;
  }, 0);
  checkOutTotal.textContent = `Order Total:     $${amountTotal.toFixed(2)}`;
}
function deleteItem() {
  cart.splice(deleteI, 1);
}

function renderCart(cart) {
  cartBox.innerHTML = "";

  if (cart.length === 0) {
    itemCount.textContent = "Your Cart (0)";
    totalAmount.textContent = "Total: $0";
    document.querySelector(".cart-container").innerHTML += `<img
            class="empty-img"
            src="./assets/images/illustration-empty-cart.svg"
            alt=""
          />
          <p>your added item will appear here</p>`;
    confirmButton.classList.add("hidden");
    totalAmount.classList.add("hidden");

    renderDisplay(dessertsArray);
    return;
  }

  cart.forEach((item) => {
    cartBox.innerHTML += `
    <div class="orderItem-div">
      <p>${item.name}</P>
      <div class="pricetag">
        <p>${item.quantity}x <span>@ $${item.price.toFixed(2)}<span></p>
        <P>$${item.price * item.quantity}</p>
      </div>
    </div>
    
    `;
    confirmButton.classList.remove("hidden");
    totalAmount.classList.remove("hidden");
    const amountTotal = cart.reduce((totalPrice, item) => {
      return totalPrice + item.price * item.quantity;
    }, 0);
    const totalCount = cart.reduce((count, item) => {
      return count + item.quantity;
    }, 0);

    itemCount.textContent = `Your Cart (${totalCount})`;
    totalAmount.textContent = `Total: $${amountTotal.toFixed(2)}`;

    console.log(itemCount.innerHTML);
  });
  renderDisplay(dessertsArray);
}

// document.querySelector(".plus").addEventListener(() => {
//   console.log("CLICKED");
// });

confirmButton.addEventListener("click", () => {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  openModal();

  document.body.style.overflow = "hidden";
});

restartButton.addEventListener("click", function startNewOrder() {
  // Empty the cart array
  cart.length = 0;

  // Remove saved cart
  localStorage.removeItem("cartValue");

  // Hide modal and overlay
  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  // Reset body scroll
  document.body.style.overflow = "auto";

  // Re-render everything
  renderCart(cart);
  renderDisplay(dessertsArray);
});
const closeModalBtn = document.querySelector(".close-modal");

closeModalBtn.addEventListener("click", function startNewOrder() {
  cart.length = 0;

  localStorage.removeItem("cartValue");

  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  document.body.style.overflow = "auto";

  renderCart(cart);
  renderDisplay(dessertsArray);
});
