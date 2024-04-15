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