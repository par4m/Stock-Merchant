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

function editProduct(pid, pname, manufacturer, mfg, exp, price, quantity) {
    // Implement edit product functionality here
}

