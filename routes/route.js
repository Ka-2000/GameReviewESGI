// Regroupement de toute les routes en fonction du nombre de page qu'il y aura. 
// Routages pour la partie Accueil - Medecin - Mutuelle - Maladie - Ordonnance - Patient - Stock

// création du routeur Express pour ce module
const express = require('express');
const routeur = express.Router();


var ctrlAccueil = require('../controllers/ControlAccueil')
var ctrlMedecin = require('../controllers/ControlMedecins');
var ctrlMutuelle = require('../controllers/ControlMutuelles');
var ctrlMaladie = require('../controllers/ControlMaladies');
var ctrlPatient = require('../controllers/ControlPatients')
var ctrlOrdonnance = require('../controllers/ControlOrdonnances')
var ctrlStock = require('../controllers/ControlStocks')

// Partie Accueil
routeur.get('/accueil', ctrlAccueil.afficher_accueil)
.get('/', ctrlAccueil.afficher_accueil)

// Partie Medecin 
routeur.get('/liste_medecins',ctrlMedecin.afficher_liste_medecins)
.get('/formulaire_medecin', ctrlMedecin.afficher_formulaire_medecin)
.get('/fiche_medecin/:id', ctrlMedecin.afficher_fiche_medecin)
.post('/formulaire_medecin', ctrlMedecin.executer_formulaire_medecin)
.post('/fiche_medecin/:id', ctrlMedecin.update_formulaire_medecin)
.post('/delete_medecin/:id', ctrlMedecin.delete_fiche_medecin)

// Partie Mutuelle
routeur.get('/liste_mutuelles', ctrlMutuelle.afficher_liste_mutuelles)
.get('/formulaire_mutuelle', ctrlMutuelle.afficher_formulaire_mutuelle)
.get('/fiche_mutuelle/:id', ctrlMutuelle.afficher_fiche_mutuelle)
.post('/formulaire_mutuelle', ctrlMutuelle.executer_formulaire_mutuelle)
.post('/fiche_mutuelle/:id', ctrlMutuelle.update_formulaire_mutuelle)
.post('/delete_mutuelle/:id', ctrlMutuelle.delete_fiche_mutuelle)

// Partie Maladie
routeur.get('/liste_pathologies', ctrlMaladie.afficher_liste_pathologies)
.get('/formulaire_pathologie', ctrlMaladie.afficher_formulaire_pathologie)
.get('/fiche_pathologie/:id', ctrlMaladie.afficher_fiche_pathologie)
.post('/formulaire_pathologie', ctrlMaladie.executer_formulaire_pathologie)
.post('/fiche_pathologie/:id', ctrlMaladie.update_formulaire_pathologie)
.post('/delete_pathologie/:id', ctrlMaladie.delete_fiche_pathologie)

// Partie patient 
routeur.get('/liste_patients', ctrlPatient.afficher_liste_patients)
.get('/addPatient', ctrlPatient.afficher_formulaire_patient)
/* .get('/fiche_patient/:id', ctrlPatient.afficher_fiche_patient) */
.post('/formulaire_patient', ctrlPatient.executer_formulaire_patient)
.post('/fiche_patient/:id', ctrlPatient.update_formulaire_patient)
.post('/delete_patient/:id', ctrlPatient.delete_fiche_patient) 

// Partie Ordonnance 
routeur.get('/liste_ordonnances', ctrlOrdonnance.afficher_liste_ordonnances)
.get('/formulaire_ordonnance', ctrlOrdonnance.afficher_formulaire_ordonnance)
.get('/fiche_ordonnance/:id', ctrlOrdonnance.afficher_fiche_ordonnance)
.post('/formulaire_ordonnance', ctrlOrdonnance.executer_formulaire_ordonnance)
.post('/fiche_ordonnances/:id', ctrlOrdonnance.update_formulaire_ordonnance)
.post('/delete_ordonnances/:id', ctrlOrdonnance.delete_fiche_ordonnance)

// Partie Stock
routeur.get('/liste_stocks', ctrlStock.afficher_liste_stocks)
.get('/formulaire_stock', ctrlStock.afficher_formulaire_stock)
.get('/fiche_stock/:id', ctrlStock.afficher_fiche_stock)
.post('/formulaire_stock', ctrlStock.executer_formulaire_stock)
.post('/fiche_stock/:id', ctrlStock.update_formulaire_stock)
.post('/delete_stock/:id', ctrlStock.delete_fiche_stock)

module.exports = routeur;