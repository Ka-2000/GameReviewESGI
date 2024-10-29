const mysql = require('mysql');
const express = require('express');
const ejs = require('ejs');
const path = require('path');  
const routeur = require('./routes/route.js');
const ctrlAuth = require('./controllers/authController'); // Assure-toi d'importer le contrôleur
const ctrlJeu = require('./controllers/ControlJeu');
const ctrlAccueil = require('./controllers/ControlAccueil.js');
var ctrlRecherche = require('./controllers/ControlRecherche');
const db = require('./connexion/loading'); // Importer la connexion à la base de données

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

app.get('/accueil', ctrlAccueil.afficher_accueil);

app.get('/recherche', ctrlRecherche.afficher_recherche);

app.get('/mon_compte', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/connexion');
    } else {
        const user = req.session.user;

        // Query to get the user's reviews including game title, review, and note
        const getReviewOfUserQuery = `
        SELECT
            j.ID_jeu,
            j.titre,
            c.avis_user,
            c.note_user
        FROM commentaires c
            LEFT JOIN jeu_commentaires jc ON jc.ID_commentaire = c.ID_commentaire
            LEFT JOIN utilisateur_commentaires uc ON uc.ID_commentaire = c.ID_commentaire
            LEFT JOIN jeux j ON j.ID_jeu = jc.ID_jeu
        WHERE uc.ID_user = ?;`;
        
        db.query(getReviewOfUserQuery, [user.ID_user], (error, results) => {
            if (error) {
                console.error("Erreur lors de la récupération des avis de l'utilisateur:", error);
                return res.status(500).send("Erreur lors de la récupération des avis de l'utilisateur");
            }

            console.log("Avis de l'utilisateur récupérés avec succès:", results);

            // Render the view with user and review data
            res.render('mon_compte', { user, reviews: results });
        });
    }
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
app.get('/deconnexion', (req, res) => {
    req.session.destroy(); // Supprimer la session
    res.redirect('/connexion');
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

//call delete_account controller
app.get('/delete_account', ctrlAuth.delete_account);





app.post('/jeu/:id/submit_review', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/connexion');
    } else {
        const id = req.params.id; // Retrieve ID from URL parameter
        console.log("ID du jeu:", id);
        if (!id) {
            return res.status(400).send("ID du jeu est manquant.");
        }
        ctrlAuth.submit_review(req, res, id);
    }
});

// ** Ajout de la route POST ici **
app.post('/connexion', ctrlAuth.login); // Gère les soumissions de formulaire de connexion
app.post('/register', ctrlAuth.register);

app.get('/jeu/:id', ctrlJeu.afficher_infosJeu);

// Utiliser le routeur pour d'autres routes
app.use('/GameReviewESGI', routeur);

// Lancer l'application sur le port 3000
app.listen(3000, () => {
    console.log('Le serveur GameReview est prêt sur le port 3000.');
});
