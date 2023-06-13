const loginButton = document.getElementById('login-button');
const email = document.getElementById('email');
const password = document.getElementById('password');

loginButton.addEventListener('click', async () => {
    if (email.value === '' || password.value === '' || email.value.includes('@') === false) {
        return
    }
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });
    const body = await response.json();
    console.log(body)
    if (body.success === false) {
        console.log('false')
        const elementById = document.getElementById('alert');
        elementById.classList.remove('hidden')
        return;
    }
    document.location.href = '/chat.html';
})
