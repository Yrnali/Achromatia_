const cartItemsList = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("total-price");

let cart = JSON.parse(localStorage.getItem("cart")) || {};

function renderCart() {
    cartItemsList.innerHTML = "";
    let total = 0;

    for (const title in cart) {
        const item = cart[title];
        const li = document.createElement("li");
        li.innerText = `${title} — $${item.price} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`;
        cartItemsList.appendChild(li);
        total += item.price * item.quantity;
    }

    totalPriceEl.innerText = total.toFixed(2);
}

function clearCart() {
    localStorage.removeItem("cart");
    cart = {};
    renderCart();
}

renderCart();