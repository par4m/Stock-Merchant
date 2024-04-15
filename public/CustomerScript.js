// CustomerScript.js

document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display available products
    fetch('/getProducts')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Clear previous products
            products.forEach(product => {
                const listItem = document.createElement('li');
                listItem.textContent = `${product.pname} - ${product.price}`;
                productList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
