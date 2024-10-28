var modelRecherche = require('../models/ModelRecherche');
const { get } = require('../routes/route');
module.exports = {
    afficher_recherche: function (req, res) {
        modelRecherche.afficher_recherche(function (data, data2, data3) {

            // Récupère toutes les infos des jeux à partir d'un titre recherché par l'utilisateur
            const getGameDataQuery = `
                SELECT *
                FROM jeux
                WHERE titre LIKE ?
            `;
            // Récupère getGameDataQuery en ajoutant un filtre sur la date : jeux sortis après 2024-01-01
            const getGameDateQueryNouveaute = getGameDataQuery + ` AND date_de_sortie > '2024-01-01'`;

            // Récupère getGameDataQuery en ajoutant un filtre sur la note du jeu en fonction de la variable noteValue
            const getGameDateQueryNote = getGameDataQuery + ` AND note_moyenne > ?`;

            // Ajoute des % avant et après le terme de recherche pour rechercher des jeux contenant le terme
            const searchTerm = `%${userInput}%`;

            //TODO : si la case Nouveauté est cochée, on utilise getGameDateQueryNouveaute
            //TODO : on utilise getGameDateQueryNote en fonction de la note minimale moyenne que l'utilisateur désire

            bd.query(getGameDataQuery, [searchTerm], function (err, getGameResult) {
                if (err) {
                    console.error("Erreur lors de l'exécution de la requête : ", err);
                    return;
                }
                console.log("Résultats : ", getGameResult);
            });
        });
    }
};
   