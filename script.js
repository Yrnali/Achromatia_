'use strict'

const catalog = document.getElementById("catalog")

fetch("./data/products.json").then(uploadProducts)

function uploadProducts(data) {
    data.json().then(getProducts)
}

function getProducts(data) {
    for (let shirtName in data) {
        const shirtData = data[shirtName]
        const shirtCard = getProductCard(shirtName, shirtData)
        catalog.append(shirtCard)
    }
}

function getProductCard(shirtName, shirtData) {
    // создаем контейнер карточки товара
    const shirtCard = document.createElement('div')
    shirtCard.className = "shirt-card"

    // название товара
    const cardTitle = document.createElement('h4')
    cardTitle.innerText = shirtName
    shirtCard.append(cardTitle) // добавляем в контейнер

    // изображения
    const cardImagesSlider = getImagesSlider(shirtData.images)
    shirtCard.append(cardImagesSlider)

    // описание
    const descriptionDiv = getDescriptionDiv(shirtData)
    shirtCard.append(descriptionDiv)

    return shirtCard
}

function getImagesSlider(imagePath) {
    // создаем контейнер слайдов
    const imagesSlider = document.createElement('div')
    imagesSlider.className = 'slider-wrapper'

    // добавляем одно изображение в слайдер
    const image = new Image()
    image.src = './images2/' + imagePath
    image.className = 'slide-image visible'
    imagesSlider.append(image)

    return imagesSlider
}

function getDescriptionDiv(shirtData) {
    const descriptionDiv = document.createElement('div')

    for (let key in shirtData) {
        if (key !== 'images') {
            const p = document.createElement('p')
            p.innerText = `${key}: ${shirtData[key]}`
            descriptionDiv.appendChild(p)
        }
    }

    // Добавим цену (если она есть)
    if (shirtData.price) {
        const price = document.createElement('h3')
        price.innerText = `Цена: ${shirtData.price}$`
        descriptionDiv.appendChild(price)
    }

    // Добавим кнопку
    const button = document.createElement('button')
    button.className = 'cartItems'
    button.innerText = 'Добавить в корзину'
    descriptionDiv.appendChild(button)

    return descriptionDiv
}

function showForwardImage(slider) {
    const images = slider.querySelectorAll('.slide-image')
    let index = 0
    while (index < images.length) {
        if (images[index].classList.contains('visible')) {
            images[index].classList.remove('visible')
            if (index === images.length - 1) {
                images[0].classList.add('visible')
            } else {
                images[index + 1].classList.add('visible')
            }
            index = images.length
        }

        index++
    }
}

function showBackImage(slider) {
    const images = slider.querySelectorAll('.slide-image');
    let index = 0;
    while (index < images.length) {
        if (images[index].classList.contains('visible')) {
            images[index].classList.remove('visible');
            if (index === 0) {
                images[images.length - 1].classList.add('visible');
            } else {
                images[index - 1].classList.add('visible');
            }
            break;
        }
        index++;
    }
}


// проверяем заказ в Local storage
let order = {}
let storageData = localStorage.getItem('order')
if (storageData) {
    order = JSON.parse(storageData)
    // считаем товары в корзине
    let count = 0
    for(let productName in order) {
        count += order[productName]
    }
    cartProductCounter.innerText = count
}

// сохранение текущих заказов
function updateLocalStorage() {
    const storageData = JSON.stringify(order)
    localStorage.setItem('order', storageData)
}

// расчёт стоимости
let total = 0;

const buttons = document.querySelectorAll('.cartItems');
const totalPriceElement = document.getElementById('total-price');

buttons.forEach(button => {
    button.addEventListener('click', () => {
        // Можно сделать цены динамическими, но здесь захардкодим:
        total += 2;
        totalPriceElement.textContent = total + ' $';
    });
});


function recalculateOrderSum() {
    let sum = 0
    const shirts = catalor.querySelectorAll(".shirt-card")
    shirts.forEach( shirt => {
        const countSpan = shirt.querySelector(".order-counter")
        const count = +countSpan.innerText

        const priceDiv = shirt.querySelector(".price")
        const priceSpan = priceDiv.querySelector("span")
        const price = +priceSpan.innerText

        if (price > 0 && count > 0) {
            sum += price * count
        }
    })

    const orderTotalSum = document.getElementById("order-total-sum")
    orderTotalSum.innerText = sum + ' $'
}

// 1. Контейнер для корзины, получение счётчика
const cartCounter = document.getElementById('cart-product-counter');

// 2. Проверка и загрузка заказов из Local Storage
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// 3. Функция подсчёта всех товаров в корзине
function countTotalItems() {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
}

// 4. Сохраняем заказы в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// 5. Обновляем счётчик товаров в иконке корзины и блоке стоимости
function updateCartUI() {
    cartCounter.textContent = countTotalItems();

    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        const totalPrice = Object.values(cart).reduce((sum, item) => sum + item.quantity * item.price, 0);
        totalPriceElement.textContent = totalPrice + " $";
    }

    updateProductButtons();
}

// 6. Добавление товара в заказ
function addToCart(productName, price = 2) {
    if (!cart[productName]) {
        cart[productName] = { quantity: 1, price: price };
    } else {
        cart[productName].quantity++;
    }

    saveCart();
    updateCartUI();
}

// 7. Удаление товара из заказа
function removeFromCart(productName) {
    if (cart[productName]) {
        cart[productName].quantity--;

        if (cart[productName].quantity <= 0) {
            delete cart[productName];
        }

        saveCart();
        updateCartUI();
    }
}

// 8. Создание кнопок добавления/удаления и отображение количества
function createControlButtons(productCard, productName) {
    const controlContainer = document.createElement('div');
    controlContainer.className = 'product-controls';

    const minusBtn = document.createElement('button');
    minusBtn.textContent = '-';
    minusBtn.classList.add('remove-btn');
    minusBtn.addEventListener('click', () => removeFromCart(productName));

    const quantityDisplay = document.createElement('span');
    quantityDisplay.className = 'product-quantity';
    quantityDisplay.textContent = cart[productName]?.quantity || 0;

    const plusBtn = document.createElement('button');
    plusBtn.textContent = '+';
    plusBtn.classList.add('add-btn');
    plusBtn.addEventListener('click', () => addToCart(productName));

    controlContainer.appendChild(minusBtn);
    controlContainer.appendChild(quantityDisplay);
    controlContainer.appendChild(plusBtn);

    productCard.appendChild(controlContainer);
}

// 9. Инициализация кнопок "добавить в корзину"
function initAddButtons() {
    const cards = document.querySelectorAll('.shirt-card');
    cards.forEach(card => {
        const name = card.querySelector('h4').textContent;
        const button = card.querySelector('button');

        if (button && !card.querySelector('.product-controls')) {
            createControlButtons(card, name);
        }

        button.addEventListener('click', () => addToCart(name));
    });
}

// 10. Обновление всех кнопок и отображения количества
function updateProductButtons() {
    const cards = document.querySelectorAll('.shirt-card');
    cards.forEach(card => {
        const name = card.querySelector('h4').textContent;
        const quantityEl = card.querySelector('.product-quantity');
        if (quantityEl) {
            quantityEl.textContent = cart[name]?.quantity || 0;
        }
    });
}

// Запускаем при загрузке
initAddButtons();
updateCartUI();

const cartProductCounter = document.getElementById("cart-product-counter")
const isCart = window.location.pathname.endsWith('cart.html')

function updateCartCounter(value) {
    if (isCart === true) {
        return
    }

    const count = +cartProductCounter.innerText
    cartProductCounter.innerText = count + value
}

// Переход на страницу корзины по клику на иконку
document.getElementById("cart").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "cart.html";
});

// Поиск товаров
const searchInput = document.getElementById('search')
const searchButton = document.getElementById('search-button')

// Отслеживаем клик по кнопке поиска
searchButton.addEventListener('click', searchProducts)
// Также сработает при нажатии Enter
searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        searchProducts()
    }

    // Сброс при удалении последней буквы
    if (e.key === 'Backspace' && searchInput.value.length <= 1) {
        resetSearch()
    }
})

function resetSearch() {
    document.querySelectorAll('.shirt-card').forEach(card => {
        card.style.display = 'block'
    })
}


function searchProducts() {
    const query = searchInput.value.toLowerCase()
    const allCards = document.querySelectorAll('.shirt-card')

    allCards.forEach(card => {
        const title = card.querySelector('h4').innerText.toLowerCase()
        if (title.includes(query)) {
            card.style.display = 'block'
        } else {
            card.style.display = 'none'
        }
    })
}
