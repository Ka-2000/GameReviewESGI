// création du routeur Express pour ce module
const express = require('express');
const routeur = express.Router();
const path = require('path'); 


var ctrlAccueil = require('../controllers/ControlAccueil');
var ctrlRecherche = require('../controllers/ControlRecherche');
var ControlMonCompte = require('../controllers/ControlMonCompte');
var ctrlAuth = require('../controllers/authController');
const ctrlJeu = require('../controllers/ControlJeu');


// Partie Accueil
routeur.get('/accueil', ctrlAccueil.afficher_accueil);

// routeur.get('/accueil', (req, res) => {
//     const user = req.session.user; // Récupérer l'utilisateur de la session
//     res.render('accueil', { user }); // Passer l'utilisateur à la vue
// });

//Partie MonCompte
routeur.get('/mon_compte', ControlMonCompte.afficher_monCompte)
.get('/', ControlMonCompte.afficher_monCompte)


routeur.get('/mon_compte', (req, res) => {
    const user = req.session.user; // Récupérer l'utilisateur de la session
    res.render('mon_compte', { user }); // Passer l'utilisateur à la vue
});

routeur.get('/jeu/:id', ctrlJeu.afficher_infosJeu);



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

routeur.get('/mon_compte', (req, res) => {
    // Check if the user is already logged in
    if (req.session.user) {
        // Redirect to accueil if the user is already connected
        return res.redirect('/mon_compte');
    }

    // If not logged in, render the registration page
    res.render('register');  // Render the register.ejs from the 'views' folder
});

routeur.post('/register', ctrlAuth.register);

// Partie Recherche
routeur.get('/recherche', ctrlRecherche.afficher_recherche);


module.exports = routeur;