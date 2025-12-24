// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';

// ============== PRODUCT API CALLS ==============

/**
 * Fetch all products from backend
 */
async function fetchProducts(filters = {}) {
    try {
        // Build query string from filters
        const queryParams = new URLSearchParams();
        
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.search) queryParams.append('search', filters.search);
        if (filters.featured) queryParams.append('featured', filters.featured);
        if (filters.sort) queryParams.append('sort', filters.sort);
        if (filters.page) queryParams.append('page', filters.page);
        if (filters.limit) queryParams.append('limit', filters.limit);
        
        const url = `${API_BASE_URL}/products?${queryParams.toString()}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Failed to fetch products');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

/**
 * Fetch single product by ID
 */
async function fetchProductById(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const data = await response.json();
        
        if (data.success) {
            return data.data;
        } else {
            throw new Error(data.message || 'Product not found');
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// ============== ORDER API CALLS ==============

/**
 * Create new order
 */
async function createOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            return { success: true, order: data.data };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Error creating order:', error);
        return { success: false, message: error.message };
    }
}

// ============== UI FUNCTIONS ==============

/**
 * Display products in the product grid
 */
function displayProducts(products) {
    const productGrid = document.querySelector('.product-grid');
    
    if (!productGrid) {
        console.error('Product grid not found');
        return;
    }
    
    // Clear existing products
    productGrid.innerHTML = '';
    
    if (products.length === 0) {
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; font-size: 1.2rem; color: #7f8c8d;">Tidak ada produk ditemukan</p>';
        return;
    }
    
    // Create product cards
    products.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

/**
 * Create product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.productId = product._id;
    
    // Format price to Indonesian Rupiah
    const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(product.price);
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 400%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2224%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-price">${formattedPrice}</div>
            <div class="product-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}">
                ${product.stock > 0 ? `Stok: ${product.stock}` : 'Stok Habis'}
            </div>
            <button class="btn-order" onclick="handleOrderClick('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
                ${product.stock > 0 ? 'Pesan Sekarang' : 'Stok Habis'}
            </button>
        </div>
    `;
    
    return card;
}

/**
 * Handle order button click
 */
function handleOrderClick(productId) {
    // Store product ID for order form
    sessionStorage.setItem('selectedProductId', productId);
    
    // Show order modal or redirect to order page
    showOrderModal(productId);
}

/**
 * Show order modal
 */
async function showOrderModal(productId) {
    const product = await fetchProductById(productId);
    
    if (!product) {
        alert('Produk tidak ditemukan');
        return;
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'order-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeOrderModal()">&times;</span>
            <h2>Form Pemesanan</h2>
            <div class="order-product-info">
                <img src="${product.image}" alt="${product.name}">
                <div>
                    <h3>${product.name}</h3>
                    <p>${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}</p>
                </div>
            </div>
            <form id="orderForm" onsubmit="submitOrder(event, '${product._id}', ${product.price})">
                <div class="form-group">
                    <label>Nama Lengkap *</label>
                    <input type="text" name="name" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required>
                </div>
                <div class="form-group">
                    <label>No. Telepon *</label>
                    <input type="tel" name="phone" required>
                </div>
                <div class="form-group">
                    <label>Alamat Lengkap *</label>
                    <textarea name="street" required rows="3"></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Kota *</label>
                        <input type="text" name="city" required>
                    </div>
                    <div class="form-group">
                        <label>Provinsi *</label>
                        <input type="text" name="province" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Kode Pos *</label>
                    <input type="text" name="postal_code" required>
                </div>
                <div class="form-group">
                    <label>Jumlah *</label>
                    <input type="number" name="quantity" min="1" max="${product.stock}" value="1" required>
                </div>
                <div class="form-group">
                    <label>Metode Pembayaran *</label>
                    <select name="payment_method" required>
                        <option value="">Pilih Metode</option>
                        <option value="transfer">Transfer Bank</option>
                        <option value="cod">Cash on Delivery (COD)</option>
                        <option value="ewallet">E-Wallet</option>
                    </select>
                </div>
                <button type="submit" class="btn-submit">Kirim Pesanan</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles if not exists
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            .order-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            .modal-content {
                background: white;
                padding: 2rem;
                border-radius: 15px;
                max-width: 600px;
                width: 90%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .close-modal {
                position: absolute;
                top: 1rem;
                right: 1rem;
                font-size: 2rem;
                cursor: pointer;
                color: #999;
            }
            .close-modal:hover { color: #333; }
            .order-product-info {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                background: #f8f9fa;
                border-radius: 10px;
                margin-bottom: 1.5rem;
            }
            .order-product-info img {
                width: 80px;
                height: 80px;
                object-fit: cover;
                border-radius: 8px;
            }
            .form-group {
                margin-bottom: 1rem;
            }
            .form-group label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: var(--text-dark);
            }
            .form-group input,
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e0e0e0;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s;
            }
            .form-group input:focus,
            .form-group textarea:focus,
            .form-group select:focus {
                outline: none;
                border-color: var(--secondary-color);
            }
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
            }
            .btn-submit {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s;
            }
            .btn-submit:hover {
                transform: translateY(-2px);
            }
            .product-price {
                font-size: 1.3rem;
                font-weight: 700;
                color: var(--secondary-color);
                margin: 0.5rem 0;
            }
            .product-stock {
                font-size: 0.9rem;
                margin: 0.5rem 0;
            }
            .product-stock.in-stock {
                color: #27ae60;
            }
            .product-stock.out-of-stock {
                color: #e74c3c;
            }
            .btn-order {
                width: 100%;
                padding: 0.75rem;
                background: linear-gradient(135deg, var(--secondary-color), var(--accent-color));
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.3s;
                margin-top: 1rem;
            }
            .btn-order:hover:not(:disabled) {
                transform: translateY(-2px);
            }
            .btn-order:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Close order modal
 */
function closeOrderModal() {
    const modal = document.querySelector('.order-modal');
    if (modal) {
        modal.remove();
    }
}

/**
 * Submit order form
 */
async function submitOrder(event, productId, productPrice) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const orderData = {
        customer: {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: {
                street: formData.get('street'),
                city: formData.get('city'),
                province: formData.get('province'),
                postal_code: formData.get('postal_code')
            }
        },
        items: [{
            product: productId,
            quantity: parseInt(formData.get('quantity'))
        }],
        payment_method: formData.get('payment_method')
    };
    
    // Show loading
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    
    const result = await createOrder(orderData);
    
    if (result.success) {
        alert(`Pesanan berhasil dibuat!\n\nOrder ID: ${result.order._id}\nTotal: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(result.order.total_amount)}\n\nTerima kasih telah berbelanja di AENS Perfume!`);
        closeOrderModal();
        // Refresh products to update stock
        loadProducts();
    } else {
        alert('Gagal membuat pesanan: ' + result.message);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// ============== INITIALIZATION ==============

/**
 * Load and display products on page load
 */
async function loadProducts() {
    const products = await fetchProducts({ featured: true });
    displayProducts(products);
}

// Load products when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadProducts);
} else {
    loadProducts();
}

console.log('🌸 AENS Perfume Frontend API Integration Loaded');