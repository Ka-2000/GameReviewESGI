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



const session = require('express-session');

app.use(session({
    secret: 'esgi', // Valeur vide ou à remplacer par une chaîne aléatoire
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false, // Mettez à true si vous utilisez HTTPS
        maxAge: 20 * 60 * 1000 // Durée de la session en millisecondes (20 minutes)
    }
}));
// Routes principales
app.get('/', (req, res) => {
    console.log('Page d\'accueil demandée');
    res.send('Le serveur GameReview est actif !');
});



app.get('/accueil', (req, res) => {
    const user = req.session.user; // Récupérer l'utilisateur de la session
    res.render('accueil', { user }); // Passer l'utilisateur à la vue
});


app.get('/recherche', (req, res) => {
    res.render('recherche');
});

app.get('/infosJeu', (req, res) => {
    res.render('infosJeu');
});

app.get('/mon_compte', (req, res) => {
    res.render('mon_compte');
});

app.get('/connexion', (req, res) => {
    // Check if the user is already logged in
    if (req.session.user) {
        // Redirect to accueil if the user is already connected
        return res.redirect('/accueil');
    }

    // If not logged in, render the connexion page
    res.render('connexion');
});

app.get('/register', (req, res) => {
    // Check if the user is already logged in
    if (req.session.user) {
        // Redirect to accueil if the user is already connected
        return res.redirect('/accueil');
    }

    // If not logged in, render the registration page
    res.render('register');
});


// ** Ajout de la route POST ici **
app.post('/connexion', ctrlAuth.login); // Gère les soumissions de formulaire de connexion
app.post('/register', ctrlAuth.register);



// Utiliser le routeur pour d'autres routes
app.use('/GameReviewESGI', routeur);

// Lancer l'application sur le port 3000
app.listen(3000, () => {
    console.log('Le serveur GameReview est prêt sur le port 3000.');
});
