const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let users = [];

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Пользователь уже зарегистрирован' });
    }

    const newUser = { id: users.length + 1, username, password };
    users.push(newUser);

    res.status(201).json({ message: 'Пользователь успешно зарегестрирован!' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Данного пользователя не существует' });
    }
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            req.token = token;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Вот они засекреченные данные хехе', user: req.user, token: req.token });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});