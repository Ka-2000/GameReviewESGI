// Regroupement de toute les routes en fonction du nombre de page qu'il y aura. 
// Routages pour la partie Accueil - Medecin - Mutuelle - Maladie - Ordonnance - Patient - Stock

// création du routeur Express pour ce module
const express = require('express');
const routeur = express.Router();
const path = require('path'); 


var ctrlAccueil = require('../controllers/ControlAccueil');
var ctrlRecherche = require('../controllers/ControlRecherche');
var ctrlInfosJeu = require('../controllers/ControlInfosJeu');
const ControlInfosJeu = require('../controllers/ControlInfosJeu');
var ctrlAuth = require('../controllers/authController');




// Partie Accueil
routeur.get('/accueil', ctrlAccueil.afficher_accueil)
.get('/', ctrlAccueil.afficher_accueil)

routeur.get('/accueil', (req, res) => {
    const user = req.session.user; // Récupérer l'utilisateur de la session
    res.render('accueil', { user }); // Passer l'utilisateur à la vue
});


routeur.get('/connexion', (req, res) => {
    res.render('connexion'); // Rendre le fichier connexion.ejs depuis le dossier 'views'
});

// Route pour traiter la connexion

routeur.post('/connexion', (req, res, next) => {
    // Check if the user is already logged in
    if (req.session.user) {
        // Redirect to accueil if the user is already connected
        return res.redirect('/accueil');
    }
    
    // If not logged in, proceed to call the login controller
    ctrlAuth.login(req, res, next);
});

routeur.get('/register', (req, res) => {
    // Check if the user is already logged in
    if (req.session.user) {
        // Redirect to accueil if the user is already connected
        return res.redirect('/accueil');
    }

    // If not logged in, render the registration page
    res.render('register');  // Render the register.ejs from the 'views' folder
});


routeur.post('/register', ctrlAuth.register);

// Partie Recherche
routeur.get('/recherche', ctrlRecherche.afficher_recherche)
.get('/', ctrlRecherche.afficher_recherche)

// Partie InfosJeu
routeur.get('/infosJeu', ControlInfosJeu.afficher_infosJeu)
.get('/', ControlInfosJeu.afficher_infosJeu)

module.exports = routeur;