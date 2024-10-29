const { get } = require('../routes/route');
var bd = require('../connexion/loading'); // DB connection

module.exports = {
    afficher_recherche: function (req, res) {
        const searchValue = req.query.search;

        const getGamesDataQuery = `
            SELECT * FROM jeux
            WHERE titre LIKE ?;
        `;

        bd.query(getGamesDataQuery, [`%${searchValue}%`], function (err, getGamesResult) {
            if (err) {
                console.error("Erreur lors de l'exécution de la requête : ", err);
                return;
            }

            var gamesAverage = [];
            var GamesPromises = getGamesResult.map(gameResult => {
                const currentIdGame = gameResult.ID_jeu;
                const gamesReview = `
                    SELECT AVG(note_user) AS avg_note, COUNT(note_user) AS count_note
                    FROM commentaires c
                    LEFT JOIN jeu_commentaires jc ON jc.ID_commentaire = c.ID_commentaire
                    WHERE jc.ID_jeu = ?;
                `;
            
                return new Promise((resolve, reject) => {
                    bd.query(gamesReview, [currentIdGame], function (err, result) {
                        if (err) {
                            console.error("Get review data SQL error:", err);
                            reject(err);
                        } else {
                            const avgNote = result[0].avg_note || 0;  // Default to 0 if no average
                            const countNote = result[0].count_note || 0; // Default to 0 if no count
                            gamesAverage.push({ avgNote, countNote });
                            resolve();
                        }
                    });
                });
            });
            
            // Attendre que toutes les requêtes soient terminées
            Promise.all(GamesPromises).then(() => {
                res.render('recherche', {
                    getGamesResult,
                    gamesAverage
                });
            }).catch(err => {
                console.error("Erreur lors du remplissage de recentlyAddedGames :", err);
            });

        });
    }
};