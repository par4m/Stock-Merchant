document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display available products
    fetch('/inventory')
        .then(response => response.json())
        .then(products => {
            const productList = document.getElementById('product-list');
            productList.innerHTML = ''; // Clear previous products
            products.forEach(product => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <span>${product.pname} - ${product.price}</span>
                    <select id="qty-${product.pid}">
                        ${generateQuantityOptions(product.quantity)}
                    </select>
                    <button onclick="buyNow('${product.pname}', '${product.price}', ${product.pid})">Buy Now</button>
                `;
                productList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

// Function to generate quantity options
function generateQuantityOptions(maxQuantity) {
    let options = '';
    for (let i = 1; i <= maxQuantity; i++) {
        options += `<option value="${i}">${i}</option>`;
    }
    return options;
}

// Function to handle buy now button click
function buyNow(productName, price, productId) {
    // Get the selected quantity
    const selectedQuantity = document.getElementById(`qty-${productId}`).value;

    // Redirect to buy.html with product details
    const queryParams = new URLSearchParams();
    queryParams.append('productName', productName);
    queryParams.append('price', price);
    queryParams.append('productId', productId);
    queryParams.append('quantity', selectedQuantity);

    // Construct the URL with query parameters
    const buyUrl = `/buy.html?${queryParams.toString()}`;

    // Redirect to buy.html
    window.location.href = buyUrl;
}