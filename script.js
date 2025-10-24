// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navContainer = document.getElementById('navContainer');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navContainer.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navContainer.classList.remove('active');
        });
    });
    
    // Load products on products page
    if (document.getElementById('productsGrid')) {
        loadProducts();
        updateCartDisplay();
    }
    
    // Order page functionality
    if (document.getElementById('orderForm')) {
        setupOrderPage();
    }
});

// Product data
const products = [
    {
        id: 1,
        name: "Caramel Popcorn",
        description: "Sweet, buttery caramel coated popcorn with a perfect crunch",
        price: "₦1,500",
        icon: "🍿",
        category: "popcorn"
    },
    {
        id: 2,
        name: "Cheese Popcorn",
        description: "Savory cheese flavored popcorn for a tasty snack",
        price: "₦1,500",
        icon: "🍿",
        category: "popcorn"
    },
    {
        id: 3,
        name: "Chocolate Popcorn",
        description: "Rich chocolate drizzled popcorn for chocolate lovers",
        price: "₦1,800",
        icon: "🍿",
        category: "popcorn"
    },
    {
        id: 4,
        name: "Classic Banana Bread",
        description: "Moist and flavorful homemade banana bread",
        price: "₦2,500",
        icon: "🍌",
        category: "banana-bread"
    },
    {
        id: 5,
        name: "Chocolate Chip Banana Bread",
        description: "Banana bread loaded with chocolate chips",
        price: "₦3,000",
        icon: "🍌",
        category: "banana-bread"
    },
    {
        id: 6,
        name: "Nutty Banana Bread",
        description: "Banana bread with walnuts for extra crunch",
        price: "₦3,200",
        icon: "🍌",
        category: "banana-bread"
    },
    {
        id: 7,
        name: "Brownies",
        description: "Rich, fudgy chocolate brownies",
        price: "₦1,800",
        icon: "🍫",
        category: "sweet-treats"
    },
    {
        id: 8,
        name: "Cookies",
        description: "Soft and chewy homemade cookies",
        price: "₦1,200",
        icon: "🍪",
        category: "sweet-treats"
    },
    {
        id: 9,
        name: "Chocolate Bark",
        description: "Delicious chocolate bark with various toppings",
        price: "₦2,000",
        icon: "🍫",
        category: "sweet-treats"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('rucoCart')) || [];

function saveCart() {
    localStorage.setItem('rucoCart', JSON.stringify(cart));
}

function addToCart(productId, quantity) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity = quantity;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartDisplay();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const proceedToOrder = document.getElementById('proceedToOrder');
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>No items selected yet. Browse our products above!</p>';
            if (proceedToOrder) {
                proceedToOrder.style.display = 'none';
            }
        } else {
            let html = '';
            cart.forEach(item => {
                html += `
                    <div class="cart-item">
                        <div>
                            <strong>${item.name}</strong>
                            <div>Quantity: ${item.quantity}</div>
                        </div>
                        <div>
                            <span>${item.price}</span>
                            <button onclick="removeFromCart(${item.id})" class="quantity-btn" style="margin-left: 10px;">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            cartItems.innerHTML = html;
            
            if (proceedToOrder) {
                proceedToOrder.style.display = 'block';
            }
        }
    }
}

function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsGrid) {
        let html = '';
        products.forEach(product => {
            const cartItem = cart.find(item => item.id === product.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            
            html += `
                <div class="product-card pop-in">
                    <div class="product-image">
                        ${product.icon}
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">${product.price}</div>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity - 1})">-</button>
                            <input type="number" class="quantity-input" id="quantity-${product.id}" value="${quantity}" min="0" onchange="updateQuantity(${product.id}, this.value)">
                            <button class="quantity-btn" onclick="updateQuantity(${product.id}, ${quantity + 1})">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsGrid.innerHTML = html;
    }
}

function updateQuantity(productId, newQuantity) {
    newQuantity = parseInt(newQuantity);
    if (newQuantity < 0) newQuantity = 0;
    
    const input = document.getElementById(`quantity-${productId}`);
    if (input) {
        input.value = newQuantity;
    }
    
    if (newQuantity === 0) {
        removeFromCart(productId);
    } else {
        addToCart(productId, newQuantity);
    }
}

// Order page functionality
function setupOrderPage() {
    const previewOrderBtn = document.getElementById('previewOrder');
    const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
    const orderForm = document.getElementById('orderForm');
    
    // Display order summary from cart
    const orderSummary = document.getElementById('orderSummary');
    if (orderSummary && cart.length > 0) {
        let html = '';
        cart.forEach(item => {
            html += `<div>${item.name} - Quantity: ${item.quantity}</div>`;
        });
        orderSummary.innerHTML = html;
    } else if (orderSummary) {
        orderSummary.innerHTML = '<p>No items in your cart. <a href="products.html">Add some products first</a>.</p>';
    }
    
    previewOrderBtn.addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const receipt = document.getElementById('receipt').files[0];
        
        // Basic validation
        if (!name || !phone || !address) {
            alert('Please fill in all required fields (Name, Phone, Address)');
            return;
        }
        
        if (cart.length === 0) {
            alert('Please add some products to your order first');
            return;
        }
        
        // Generate preview
        const previewContent = document.getElementById('previewContent');
        let orderDetails = '';
        cart.forEach(item => {
            orderDetails += `${item.name} - Quantity: ${item.quantity}\n`;
        });
        
        let receiptInfo = 'No receipt uploaded';
        if (receipt) {
            receiptInfo = `Receipt uploaded: ${receipt.name}`;
        }
        
        const previewHTML = `
            <div class="preview-item">
                <strong>Name:</strong> ${name}
            </div>
            <div class="preview-item">
                <strong>Phone:</strong> ${phone}
            </div>
            <div class="preview-item">
                <strong>Address:</strong> ${address}
            </div>
            <div class="preview-item">
                <strong>Order Details:</strong><br>
                <pre>${orderDetails}</pre>
            </div>
            <div class="preview-item">
                <strong>Receipt:</strong> ${receiptInfo}
            </div>
        `;
        
        previewContent.innerHTML = previewHTML;
        
        // Enable WhatsApp button
        sendWhatsAppBtn.disabled = false;
        
        // Store order data for WhatsApp
        sendWhatsAppBtn.onclick = function() {
            sendOrderViaWhatsApp(name, phone, address, receiptInfo, orderDetails);
        };
    });
}

function sendOrderViaWhatsApp(name, phone, address, receiptInfo, orderDetails) {
    const message = `New Order from RuCo Foods Website:
Name: ${name}
Phone: ${phone}
Address: ${address}

Order Details:
${orderDetails}
Receipt: ${receiptInfo}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/2349051811650?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}