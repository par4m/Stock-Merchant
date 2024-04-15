document.addEventListener('DOMContentLoaded', function() {
    fetch('/inventory')
        .then(response => response.json())
        .then(inventory => {
            const inventoryList = document.getElementById('inventory-list');
            inventory.forEach(product => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${product.pname} - ${product.price}</span>
                    <button onclick="deleteProduct('${product.pid}')">Delete</button>
                    <button onclick="editProduct('${product.pid}', '${product.pname}', '${product.manufacturer}', '${product.mfg}', '${product.exp}', ${product.price}, ${product.quantity})">Edit</button>
                `;
                inventoryList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching inventory:', error));
        
    const addProductForm = document.getElementById('add-product-form');

    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        const pid = formData.get('pid');
        const pname = formData.get('pname');
        const manufacturer = formData.get('manufacturer');
        const mfg = formData.get('mfg');
        const exp = formData.get('exp');
        const price = formData.get('price');
        const quantity = formData.get('quantity');

        fetch('/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pid, pname, manufacturer, mfg, exp, price, quantity })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add product');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.message); // Product added successfully
            location.reload(); // Refresh the page to reflect the new product
        })
        .catch(error => console.error('Error adding product:', error));
    });
});

function deleteProduct(pid) {
    fetch(`/product/${pid}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        location.reload();
    })
    .catch(error => console.error('Error deleting product:', error));
}



// Function to handle edit button click
function editProduct(pid) {
    fetch(`/product/${pid}`)
        .then(response => response.json())
        .then(product => {
            // Fill the form fields with product details
            document.getElementById('pid').value = product.pid;
            document.getElementById('pname').value = product.pname;
            document.getElementById('manufacturer').value = product.manufacturer;
            // document.getElementById('mfg').value = product.mfg;
            // document.getElementById('exp').value = product.exp;
             document.getElementById('mfg').value = formatDate(product.mfg); // Format date
             document.getElementById('exp').value = formatDate(product.exp); // Format date
            document.getElementById('price').value = product.price;
            document.getElementById('quantity').value = product.quantity;

            // Change button text and action
            const addButton = document.getElementById('add-button');
            addButton.textContent = 'Update Product';
            addButton.onclick = function() { updateProduct(pid); };
        })
        .catch(error => console.error('Error fetching product:', error));
}

// Function to format date as YYYY-MM-DD
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


// Function to handle update product
function updateProduct(pid) {
    const formData = new FormData(document.getElementById('add-product-form'));
    const pname = formData.get('pname');
    const manufacturer = formData.get('manufacturer');
    const mfg = formData.get('mfg');
    const exp = formData.get('exp');
    const price = formData.get('price');
    const quantity = formData.get('quantity');

    fetch(`/product/${pid}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pname, manufacturer, mfg, exp, price, quantity })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update product');
        }
        console.log('Product updated successfully');
        // Reset form fields
        document.getElementById('add-product-form').reset();
        // Change button text and action back to add product
        const addButton = document.getElementById('add-button');
        addButton.textContent = 'Add Product';
        addButton.onclick = function() { addProduct(); };
    })
    .catch(error => console.error('Error updating product:', error));

      // After updating product successfully, reload inventory
    loadInventory();
}

// Function to load inventory
function loadInventory() {
    const inventoryList = document.getElementById('inventory-list');
    // Clear previous inventory items
    inventoryList.innerHTML = '';
    
    // Fetch updated inventory data
    fetch('/inventory')
        .then(response => response.json())
        .then(inventory => {
            inventory.forEach(product => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${product.pname} - ${product.price}</span>
                    <button onclick="deleteProduct('${product.pid}')">Delete</button>
                    <button onclick="editProduct('${product.pid}', '${product.pname}', '${product.manufacturer}', '${product.mfg}', '${product.exp}', ${product.price}, ${product.quantity})">Edit</button>
                `;
                inventoryList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching inventory:', error));
}

function fetchOrders() {
    fetch('/orders')
        .then(response => response.json())
        .then(orders => {
            orders.forEach(order => {
                const orderElement = createOrderElement(order);
                const orderContainer = getOrderContainer(order);
                if (!orderContainer.querySelector(`[data-order-id="${order.id}"]`)) {
                    orderContainer.appendChild(orderElement);
                }
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function getOrderContainer(order) {
    if (order.status === null) {
        return document.getElementById('pending-orders');
    } else if (order.status === 'Shipped') {
        return document.getElementById('shipped-orders');
    } else if (order.status === 'Delivered') {
        return document.getElementById('delivered-orders');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display orders
    fetchOrders();

    // Handle click on "Shipped" button for pending orders
    document.getElementById('pending-orders').addEventListener('click', function(event) {
        if (event.target.classList.contains('ship-button')) {
            const orderId = event.target.dataset.orderId;
            updateOrderStatus(orderId, 'Shipped');
        }
    });

    // Handle click on "Delivered" button for shipped orders
    document.getElementById('shipped-orders').addEventListener('click', function(event) {
        if (event.target.classList.contains('deliver-button')) {
            const orderId = event.target.dataset.orderId;
            updateOrderStatus(orderId, 'Delivered');
        }
    });
});

function fetchOrders() {
    fetch('/orders')
        .then(response => response.json())
        .then(orders => {
            orders.forEach(order => {
                const orderElement = createOrderElement(order);
                if (order.status === null) {
                    document.getElementById('pending-orders').appendChild(orderElement);
                } else if (order.status === 'Shipped') {
                    document.getElementById('shipped-orders').appendChild(orderElement);
                } else if (order.status === 'Delivered') {
                    document.getElementById('delivered-orders').appendChild(orderElement);
                }
            });
        })
        .catch(error => console.error('Error fetching orders:', error));
}

function createOrderElement(order) {
    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');
    orderDiv.innerHTML = `
        <p>Order ID: ${order.id}</p>
        <p>Product: ${order.product}</p>
        <p>Quantity: ${order.quantity}</p>
        <p>Address: ${order.address}</p>
        <p>Payment Mode: ${order.payment_mode}</p>
        <p>Status: ${order.status || 'Pending'}</p>
        <p>Order Date: ${order.order_date}</p>
    `;
    if (order.status === null) {
        const shipButton = document.createElement('button');
        shipButton.textContent = 'Shipped';
        shipButton.classList.add('ship-button');
        shipButton.dataset.orderId = order.id;
        orderDiv.appendChild(shipButton);
    } else if (order.status === 'Shipped') {
        const deliverButton = document.createElement('button');
        deliverButton.textContent = 'Delivered';
        deliverButton.classList.add('deliver-button');
        deliverButton.dataset.orderId = order.id;
        orderDiv.appendChild(deliverButton);
    }
    return orderDiv;
}

function updateOrderStatus(orderId, status) {
    fetch(`/order/${orderId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update order status');
        }
        location.reload(); // Refresh the page to reflect the updated status
    })
    .catch(error => console.error('Error updating order status:', error));
}
