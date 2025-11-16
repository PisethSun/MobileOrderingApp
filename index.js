import { menuArray } from "./data.js";

let orderItems = []; 

/* -------------------- RENDER MENU -------------------- */
function getFeedHTML() {
    let feedHTML = "";

    menuArray.forEach(item => {
        feedHTML += `
            <div class="menu-item">
                <div class="menu-left">
                    <span class="emoji">${item.emoji}</span>

                    <div class="menu-info">
                        <h2>${item.name}</h2>
                        <p>${item.ingredients.join(", ")}</p>
                        <div class="menu-price">$${item.price}</div>
                    </div>
                </div>

                <button class="add-btn" data-id="${item.id}">+</button>
            </div>

            <hr class="divider">
        `;
    });

    return feedHTML;
}

/* -------------------- RENDER ORDER -------------------- */
function getOrderHTML() {
    if (orderItems.length === 0) return "";

    let html = `<h2 class="order-title">Your order</h2>`;

    orderItems.forEach(item => {
        html += `
            <div class="order-row">
                <div>
                    <span class="order-name">${item.name}</span>
                    <span class="remove-btn" data-remove="${item.id}">remove</span>
                </div>
                <div class="order-price">$${item.price}</div>
            </div>
        `;
    });

    const total = orderItems.reduce((sum, item) => sum + item.price, 0);

    html += `
        <hr class="order-divider">

        <div class="total-row">
            <span>Total price:</span>
            <span class="order-total">$${total}</span>
        </div>

        <button class="complete-btn">Complete order</button>
    `;

    return html;
}

/* -------------------- PAYMENT POPUP -------------------- */
function showPaymentPopup() {
    const popupHTML = `
        <div id="payment-popup" class="popup-overlay">
            <div class="payment-card">
                <h3>Enter card details</h3>

                <form id="payment-form">
                    <input id="full-name" type="text" placeholder="Full name" required>
                    <input type="text" placeholder="Card number" required>
                    <input type="password" placeholder="CVV" required maxlength="3">
                    <button type="submit" class="pay-btn">Pay</button>
                </form>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", popupHTML);
}

/* -------------------- RENDER EVERYTHING -------------------- */
function render() {
    document.getElementById("feed").innerHTML = getFeedHTML() + getOrderHTML();
}

render();

/* -------------------- EVENT LISTENERS -------------------- */
document.addEventListener("click", function (e) {

    // ADD ITEM
    if (e.target.dataset.id) {
        const item = menuArray.find(m => m.id == e.target.dataset.id);
        orderItems.push(item);
        render();
    }

    // REMOVE ITEM
    if (e.target.dataset.remove) {
        const id = Number(e.target.dataset.remove);
        orderItems = orderItems.filter(item => item.id !== id);
        render();
    }

    // SHOW PAYMENT POPUP
    if (e.target.classList.contains("complete-btn")) {
        showPaymentPopup();
    }
});

/* -------------------- PAYMENT SUBMIT -------------------- */
document.addEventListener("submit", function (e) {
    if (e.target.id === "payment-form") {
        e.preventDefault();

        const nameValue = document.getElementById("full-name").value;

        // Remove popup
        document.getElementById("payment-popup").remove();

        // Reset order
        orderItems = [];
        document.getElementById("feed").innerHTML = getFeedHTML();

        // Add thank-you message
        const thankYouDiv = document.createElement("div");
        thankYouDiv.classList.add("thank-you-box");
        thankYouDiv.textContent = `Thanks, ${nameValue}! Your order is on its way!`;

        document.getElementById("feed").appendChild(thankYouDiv);
    }
});
