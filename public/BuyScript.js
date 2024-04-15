document.addEventListener('DOMContentLoaded', function() {
    // Parse query parameters from the URL
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product = urlParams.get('productName');
    const quantity = urlParams.get('quantity');
    
    // Fill the product and quantity fields in the form
    document.getElementById('product').value = product;
    document.getElementById('quantity').value = quantity;

    const orderForm = document.getElementById('order-form');
    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(orderForm);
        const address = formData.get('address');
        const paymentMode = formData.get('payment-mode');

        // Construct order object
        const order = {
            product,
            quantity,
            address,
            paymentMode
        };

        // Send order data to server for processing
        fetch('/placeOrder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to place order');
            }
            // Display "Order Placed" message
            document.getElementById('order-message').innerText = 'Order Placed';

            // Redirect back to customer.html after 2 seconds
            setTimeout(function() {
                window.location.href = '/customer.html';
            }, 2000);
        })
        .catch(error => {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        });
    });
});

