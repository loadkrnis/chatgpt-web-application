const signUpButton = document.getElementById('sign-up-button');
const email = document.getElementById('input-email');
const password = document.getElementById('input-password');

signUpButton.addEventListener('click', async () => {
    if (email.value === '' || password.value === '' || email.value.includes('@') === false) {
        return
    }
    const response = await fetch('/sign-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });
    await response.json();
    document.location.href = '/chat.html';
})
