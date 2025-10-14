/**
  Shopping Cart Logic (cart.js)
  Manages all cart operations using localStorage for persistence.
  All core functions (addToCart, getCart, clearCart) are defined here.
 */

const CART_STORAGE_KEY = 'ecom_cart';
// Ensure this matches your running Express backend URL
const BACKEND_URL = "http://localhost:5000"; 

// Utility for UI Feedback (since we can't use alert()) 

function displayMessage(message, type = 'default') {
    const container = document.getElementById('message-container');
    if (!container) {
        // Fallback for pages without the container (like index.html before update)
        console.log(`[Message: ${type}] ${message}`);
        return;
    }

    const msgBox = document.createElement('div');
    msgBox.className = `p-3 mb-2 rounded-lg text-sm transition-opacity duration-300 shadow-xl ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    msgBox.textContent = message;

    // Fixed positioning for visibility on mobile and desktop
    container.style.position = 'fixed';
    container.style.top = '1rem';
    container.style.right = '1rem';
    container.style.zIndex = '50';
    container.style.maxWidth = '300px';

    container.appendChild(msgBox);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        msgBox.style.opacity = '0';
        msgBox.addEventListener('transitionend', () => msgBox.remove());
    }, 3000);
}


// --- Core Cart Functions ---

/*
  Retrieves the current cart array from localStorage.
  @returns {Array} The cart array or an empty array if none exists.
 */
function getCart() {
    try {
        const cartJson = localStorage.getItem(CART_STORAGE_KEY);
        // Returns parsed JSON or an empty array if null
        return cartJson ? JSON.parse(cartJson) : [];
    } catch (e) {
        console.error("Error reading cart from localStorage:", e);
        return [];
    }
}

/* 
 Saves the updated cart array back into localStorage and notifies listeners.
  @param {Array} cart - The cart array to save.
 */
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        // Dispatch event so other pages (like checkout) can update in real-time
        window.dispatchEvent(new Event('cartUpdated')); 
    } catch (e) {
        console.error("Error saving cart to localStorage:", e);
    }
}

/*
  Adds a product to the cart or increments its quantity.
  @param {Object} product - The product object to add (must have id, name, price, image).
 */
function addToCart(product) {
    const cart = getCart();
    // Check if item already exists in the cart
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Item is new, add it with quantity 1
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);
    displayMessage(`Added 1 x ${product.name} to cart!`, 'success');
}

/*
  Removes an item completely from the cart by product ID.
  Note: For simplicity, this removes all quantity of the item.
 */
function removeFromCart(productId) {
    let cart = getCart();
    const initialLength = cart.length;
    
    // Filter out the item to remove
    cart = cart.filter(item => item.id !== productId);

    if (cart.length < initialLength) {
        saveCart(cart);
        displayMessage('Item removed from cart.', 'info');
    }
}

/*
  Completely clears all items from the cart.
 */
function clearCart() {
    saveCart([]);
    displayMessage('Cart cleared successfully.', 'info');
}

/*
  Calculates the total price of all items in the cart.
  @param {Array} cart - The cart array.
  @returns {number} The total price.
 */
function calculateCartTotal(cart) {
    // Reduce the array to calculate the total sum (price * quantity)
    return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
}

// Expose these core functions and constants globally so they can be called from other HTML files
window.addToCart = addToCart;
window.getCart = getCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.calculateCartTotal = calculateCartTotal;
window.displayMessage = displayMessage;
window.BACKEND_URL = BACKEND_URL;
