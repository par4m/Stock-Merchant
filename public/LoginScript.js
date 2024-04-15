// script.js

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const username = formData.get('username');
        const password = formData.get('password');

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Invalid username or password');
            }
            return response.json();
        })
        .then(data => {
            // Redirect to appropriate page based on response
            if (data.role === 'admin') {
                window.location.href = '/admin.html';
            } else if (data.role === 'customer') {
                window.location.href = '/customer.html';
            } else {
                throw new Error('Invalid user role');
            }
        })
        .catch(error => {
            // Display error message on the HTML page
            errorMessage.textContent = error.message;
        });
    });
});
