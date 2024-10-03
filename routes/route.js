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

routeur.get('/connexion', (req, res) => {
    res.render('connexion'); // Rendre le fichier connexion.ejs depuis le dossier 'views'
});

// Route pour traiter la connexion

routeur.post('/connexion', ctrlAuth.login)
.post('/connexion', ctrlAuth.login);  // Utilisez login ici


routeur.get('/register', (req, res) => {
    res.render('register');  // Rendre le fichier connexion.ejs depuis le dossier 'views'
});

routeur.post('/register', ctrlAuth.register);

// Partie Recherche
routeur.get('/recherche', ctrlRecherche.afficher_recherche)
.get('/', ctrlRecherche.afficher_recherche)

// Partie InfosJeu
routeur.get('/infosJeu', ControlInfosJeu.afficher_infosJeu)
.get('/', ControlInfosJeu.afficher_infosJeu)

module.exports = routeur;