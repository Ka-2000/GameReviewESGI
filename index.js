const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');
const path = require('path');  
const routeur = require('./routes/route.js');
const ctrlAuth = require('./controllers/authController'); // Assure-toi d'importer le contrôleur

// Initialiser l'application
let app = express();

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, 'views'));

// Middleware pour gérer les fichiers statiques
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware pour servir les fichiers CSS de Bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// Routes principales
app.get('/', (req, res) => {
    console.log('Page d\'accueil demandée');
    res.send('Le serveur GameReview est actif !');
});

app.get('/accueil', (req, res) => {
    res.render('accueil');
});

app.get('/recherche', (req, res) => {
    res.render('recherche');
});

app.get('/infosJeu', (req, res) => {
    res.render('infosJeu');
});

app.get('/connexion', (req, res) => {
    res.render('connexion');
});

// ** Ajout de la route POST ici **
app.post('/connexion', ctrlAuth.login); // Gère les soumissions de formulaire de connexion
app.post('/register', ctrlAuth.register);

app.get('/register', (req, res) => {
    res.render('register');
});

// Utiliser le routeur pour d'autres routes
app.use('/GameReviewESGI', routeur);

// Lancer l'application sur le port 3000
app.listen(3000, () => {
    console.log('Le serveur GameReview est prêt sur le port 3000.');
});
