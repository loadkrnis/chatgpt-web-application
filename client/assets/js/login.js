const loginButton = document.getElementById('login-button');
const email = document.getElementById('email');
const password = document.getElementById('password');

loginButton.addEventListener('click', async () => {
    if (email.value === '' || password.value === '') {
        return
    }
    // fetch on post method with email, password /login endpoint
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
    console.log('click!');
    console.log(body);
})
