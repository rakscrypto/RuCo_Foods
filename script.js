// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navContainer = document.getElementById('navContainer');
    
    // Create overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            navContainer.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Toggle menu icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Close menu when clicking on overlay
        overlay.addEventListener('click', function() {
            navContainer.classList.remove('active');
            overlay.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navContainer) {
                navContainer.classList.remove('active');
                overlay.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Close mobile menu when clicking outside on larger screens
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navContainer) {
                navContainer.classList.remove('active');
                overlay.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
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

// Product data with images
const products = [
   {
        id: 1,
        name: "Churro Popcorn",
        description: "Sweet, buttery churro coated popcorn with a perfect crunch",
        price: "₦1,000",
        image: "11.PNG",
        category: "popcorn"
    },
    {
        id: 2,
        name: "Chocolate Popcorn",
        description: "Savory cheese flavored popcorn for a tasty snack",
        price: "₦1,000",
        image: "13.PNG",
        category: "popcorn"
    },
    {
        id: 3,
        name: "Cookie Popcorn",
        description: "Rich chocolate drizzled popcorn for chocolate lovers",
        price: "₦1,000",
        image: "10.PNG",
        category: "popcorn"
    },
    {
        id: 4,
        name: "Muddy Popcorn",
        description: "Moist and flavorful popcorn",
        price: "₦1,500",
        image: "12.PNG",
        category: "popcorn"
    },
    {
        id: 5,
        name: "Chocolate Chip Banana Bread",
        description: "Banana bread loaded with chocolate chips",
        price: "₦1,500",
        image: "15.png",
        category: "banana-bread"
    },
    {
        id: 5,
        name: "Banana Bread",
        description: "Banana bread loaded with love",
        price: "₦3,000",
        image: "14.png",
        category: "banana-bread"
    },
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
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">${product.price}</div>
                        <div class="quantity-selector">
                            <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
                            <input type="number" class="quantity-input" id="quantity-${product.id}" value="${quantity}" min="0" onchange="updateQuantityFromInput(${product.id})">
                            <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        productsGrid.innerHTML = html;
    }
}

// New quantity functions to fix the issue
function increaseQuantity(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(input.value) || 0;
    const newQuantity = currentQuantity + 1;
    input.value = newQuantity;
    
    if (newQuantity === 0) {
        removeFromCart(productId);
    } else {
        addToCart(productId, newQuantity);
    }
}

function decreaseQuantity(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    let currentQuantity = parseInt(input.value) || 0;
    const newQuantity = Math.max(0, currentQuantity - 1);
    input.value = newQuantity;
    
    if (newQuantity === 0) {
        removeFromCart(productId);
    } else {
        addToCart(productId, newQuantity);
    }
}

function updateQuantityFromInput(productId) {
    const input = document.getElementById(`quantity-${productId}`);
    let newQuantity = parseInt(input.value) || 0;
    if (newQuantity < 0) newQuantity = 0;
    
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
    
    if (previewOrderBtn) {
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
            if (sendWhatsAppBtn) {
                sendWhatsAppBtn.disabled = false;
                
                // Store order data for WhatsApp
                sendWhatsAppBtn.onclick = function() {
                    sendOrderViaWhatsApp(name, phone, address, receiptInfo, orderDetails);
                };
            }
        });
    }
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