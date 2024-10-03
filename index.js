const mysql = require('mysql')
const express = require('express');
const ejs = require('ejs');
const path     = require('path')  

const iniparser = require('iniparser')
const routeur = require('./routes/route.js');



// activer les dépendances pour Express et EJS
let app = express()
app.set('view engine', 'ejs')
app.use(express.static('views'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));

app.set("views",path.resolve(__dirname,'views'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


// activer le middleware et lancer l'application sur le port 3000
app.use(express.json())
app.listen(3000, () => console.log('Le serveur GameReview est prêt.'))

 // utiliser les routeurs
app.get('/', (req, res) => {
    res.send('Le serveur GameReview est actif !')
})


//Afficher page accueil
.get('/accueil', function(req, res) {
    res.render('accueil')
    })


//Afficher vue ...
.get('/recherche', function(req, res) {
    res.render('recherche')
    })

//Afficher vue ...
.get('/infosJeu', function(req, res) {
    res.render('infosJeu')
    })
    

//Afficher vue ...
.get('/...', function(req, res) {
    res.render('...')
    })

.get('/connexion', function(req, res) {
    res.render('connexion');
});


app.use('/GameReviewESGI', routeur)