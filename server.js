const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const port = 3000;
const secretKey = 'My super secret key';
const jwt = require('jsonwebtoken');
const exJwt = require('express-jwt');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'Content-type,Authorization');
    next();
});

let users = [
    {
        id: 1,
        username: 'Vinayakk',
        password: '999'
    },
    {
        id: 2,
        username: 'Jin',
        password: '123'
    }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const jwtMW = exJwt({ // Use 'expressJwt' with a capital 'J'
    secret: secretKey,
    algorithms: ['HS256']
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged-in people can see'
    });
});

app.get('/api/settings', jwtMW, (req, res) => { 
    res.json({
        success: true,
        sContent: 'Secret seettings page by Vinayakraddi'
    });
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        });
    } else {
        next(err);
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    for (let user of users) {
        if (username == user.username && password == user.password) {
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m' });
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        } else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Serving on Port : ${port}`);
});
