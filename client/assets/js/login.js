const loginButton = document.getElementById('login-button');
loginButton.addEventListener('click', async () => {
    await fetch('/login', {
        method: 'POST',
    });
})
