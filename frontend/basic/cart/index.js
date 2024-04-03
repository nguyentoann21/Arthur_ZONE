let cartView = document.querySelector('.cart');
let body = document.querySelector('body');
let btn_close = document.querySelector('.close');
let list_products = document.querySelector('.list-product');
let list_carts = document.querySelector('.list-cart');
let cart_span = document.querySelector('.cart span');


let productList = [];
let carts = [];

cartView.addEventListener('click', () => {
    body.classList.toggle('show-cart');
})

btn_close.addEventListener('click', () => {
    body.classList.toggle('show-cart');
})

const mil = 1000000;

const renderData = () => {
    list_products.innerHTML = '';
    if (productList.length > 0) {
        productList.forEach(fproduct => {
            let new_product = document.createElement('div');
            new_product.classList.add('item');
            new_product.dataset.id = fproduct.id;
            new_product.innerHTML = `
            <img src=${fproduct.image} alt="#" />
                <h2>${fproduct.name}</h2>
                <div class="price">${fproduct.price >= mil ? fproduct.price / mil + 'M' : fproduct.price}$</div>
                <button class="add_to_cart">Add To Cart</button>
            `;
            list_products.appendChild(new_product);
        })
    }
}

list_products.addEventListener('click', (e) => {
    let position_click = e.target;
    if (position_click.classList.contains('add_to_cart')) {
        let item_id = position_click.closest('.item').dataset.id;
        add_to_cart(item_id);
    }
})

const add_to_cart = (item_id) => {
    console.log("Adding to cart", item_id);
    let position_in_cart = carts.findIndex((val) => val.id == item_id);

    if (carts.length <= 0) {
        carts = [{
            id: item_id,
            quantity: 1
        }]
    } else if (position_in_cart < 0) {
        carts.push({
            id: item_id,
            quantity: 1
        });
    } else {
        carts[position_in_cart].quantity++;
    }
    renderCart();
    cartSession();
}

const cartSession = () => {
    localStorage.setItem('carts', JSON.stringify(carts));
}

const renderCart = () => {
    let total_quantity = 0;
    list_carts.innerHTML = '';
    if (carts.length > 0) {
        carts.forEach(cart => {
            total_quantity += cart.quantity;
            let new_cart = document.createElement('div');
            new_cart.classList.add('item');
            new_cart.dataset.id = cart.id;
            let position_product_in_cart = productList.findIndex((val) => val.id == cart.id);
            let product_data = productList[position_product_in_cart];
            new_cart.innerHTML = `
            <div class="image">
                <img src=${product_data.image} alt="#" />
            </div>
            <div class="name">${product_data.name}</div>
            <div class="total-price">${product_data.price >= mil ? ((product_data.price / mil) * cart.quantity).toFixed(1) + 'M' : (product_data.price * cart.quantity).toFixed(1)}$</div>
            <div class="quantity">
                <span class="minus"><i class="fa-solid fa-minus"></i></span>
                <span>${cart.quantity}</span>
                <span class="plus"><i class="fa-solid fa-plus"></i></span>
            </div>
            `;
            list_carts.appendChild(new_cart);
        });
    }
    cart_span.innerText = total_quantity;
}

list_carts.addEventListener('click', (e) => {
    let quantity_click = e.target;
    console.log("Clicked on:", quantity_click.className);
    if(quantity_click.classList.contains('minus') || quantity_click.classList.contains('plus')) {
        let product_id = quantity_click.closest('.item').dataset.id;
        let type = quantity_click.classList.contains('plus') ? 'plus' : 'minus';
        console.log("Product ID:", product_id, "Action:", type);
        updateQuantity(product_id, type);
    }
})

const updateQuantity = (product_id, type) => {
    let position_item_in_cart = carts.findIndex((val) => val.id == product_id);
    if(position_item_in_cart >= 0) {
        switch (type) {
            case 'plus':
                carts[position_item_in_cart].quantity++;
                break;
        
            default:
                carts[position_item_in_cart].quantity--;
                if(carts[position_item_in_cart].quantity <= 0) {
                    carts.splice(position_item_in_cart, 1);
                }
                break;
        }
    }
    cartSession();
    renderCart();
}

const initial_data = () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            productList = data;
            renderData();

            if(localStorage.getItem('carts')) {
                carts = JSON.parse(localStorage.getItem('carts'));
                renderCart();
            }
        })
}

initial_data();