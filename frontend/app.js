let token = null;

document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    const mes = document.getElementById('registerMessage');
    mes.style.display = 'block';
    mes.textContent = result.message || 'Ошибка при регистрации';
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        token = result.token;
        const mes = document.getElementById('loginMessage');
        mes.style.display = 'block';
        mes.textContent = 'Вход выполнен успешно!';
    } else {
        document.getElementById('loginMessage').textContent = result.message || 'Ошибка при входе';
    }
});

document.getElementById('fetchProtectedData').addEventListener('click', async () => {
    if (!token) {
        document.getElementById('protectedData').textContent = 'Сначала войдите в свой аккаунт';
        return;
    }

    const response = await fetch('http://localhost:3000/protected', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await response.json();
    if (response.ok) {
        displayProtectedData(result);
    } else {
        document.getElementById('protectedData').textContent = 'Access denied';
    }
});

function displayProtectedData(data) {
    const [header, payload, signature] = token.split('.');

    const decodedPayload = JSON.parse(atob(payload));
    const formattedPayload = JSON.stringify(decodedPayload, null, 2);

    const protectedDataContainer = document.getElementById('protectedData');
    protectedDataContainer.style.display = "block";

    protectedDataContainer.innerHTML = `
        <div class="data-item">${data.message}</div>
        <div class="data-item">User ID: ${data.user.userId}</div>
        <div class="token-container">
            <div class="token-part"><strong>Заголовок:</strong> <pre>${header}</pre></div>
            <div class="token-part"><strong>Полезная нагрузка:</strong> <pre>${payload}</pre></div>
            <div class="token-part_1"><strong>Расшифрованная полезная нагрузка:</strong> <pre>${formattedPayload}</pre></div>
            <div class="token-part"><strong>Подпись:</strong> <pre>${signature}</pre></div>
        </div>
    `;
}