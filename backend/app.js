const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const auth = require('./routes/auth');
const sauces = require('./routes/sauces');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// static files
app.use(express.static(path.join(__dirname, '.')));
app.use('/images', express.static(__dirname + '/images'));

mongoose.connect('mongodb://127.0.0.1:27017/piquante', { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => console.log('Connexion à MongoDB réussie !')).catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// utilisation de nos différents routes
app.use('/api/auth', auth);
app.use('/api/sauces', sauces);

module.exports = app;