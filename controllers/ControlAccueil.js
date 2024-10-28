const bd = require('../connexion/loading'); // Connexion à la base de données

module.exports = {
    afficher_accueil: function (req, res) {
        const user = req.session.user;
        const getRecentAddedGamesQuery = `
            SELECT DISTINCT * FROM jeux ORDER BY date_de_sortie DESC LIMIT 4;
        `;

        bd.query(getRecentAddedGamesQuery, [], (err, getRecentAddedGamesResult) => {
            if (err) return console.error("Erreur SQL:", err);

            const gamesRecentlyAdded = getRecentAddedGamesResult;
            
            var recentlyAddedGamesAverage = [];
            var recentlyAddedGamesPromises = gamesRecentlyAdded.map(gameRecentlyAdded => {
                const currentIdGame = gameRecentlyAdded.ID_jeu;
                const getRecentlyAddedGamesReview = `
                    SELECT AVG(note_user) AS avg_note, COUNT(note_user) AS count_note
                    FROM commentaires c
                    LEFT JOIN jeu_commentaires jc ON jc.ID_commentaire = c.ID_commentaire
                    WHERE jc.ID_jeu = ?;
                `;
            
                return new Promise((resolve, reject) => {
                    bd.query(getRecentlyAddedGamesReview, [currentIdGame], function (err, result) {
                        if (err) {
                            console.error("Get review data SQL error:", err);
                            reject(err);
                        } else {
                            const avgNote = result[0].avg_note || 0;  // Default to 0 if no average
                            const countNote = result[0].count_note || 0; // Default to 0 if no count
                            recentlyAddedGamesAverage.push({ avgNote, countNote });
                            resolve();
                        }
                    });
                });
            });
            
            // Attendre que toutes les requêtes soient terminées
            Promise.all(recentlyAddedGamesPromises).then(() => {
                const getMostLikedGamesQuery = `
                    SELECT DISTINCT j.* FROM commentaires c
                    LEFT JOIN jeu_commentaires jc ON jc.ID_commentaire = c.ID_commentaire
                    LEFT JOIN jeux j ON j.ID_jeu = jc.ID_jeu
                    ORDER BY c.note_user DESC LIMIT 4;
                `;
                bd.query(getMostLikedGamesQuery, [], (err, getMostLikedGamesResult) => {
                    if (err) return console.error("Erreur SQL:", err);

                    const gamesMostLiked = getMostLikedGamesResult;

                    var mostLikedGamesAverage = [];
                    var mostLikedGamesPromises = gamesMostLiked.map(gameMostLiked => {
                        const currentIdGame = gameMostLiked.ID_jeu;
                        const getMostLikedGames = `
                            SELECT AVG(note_user) AS avg_note, COUNT(note_user) AS count_note
                            FROM commentaires c
                            LEFT JOIN jeu_commentaires jc ON jc.ID_commentaire = c.ID_commentaire
                            WHERE jc.ID_jeu = ?;
                        `;
                    
                        return new Promise((resolve, reject) => {
                            bd.query(getMostLikedGames, [currentIdGame], function (err, result) {
                                if (err) {
                                    console.error("Get review data SQL error:", err);
                                    reject(err);
                                } else {
                                    const avgNote = result[0].avg_note || 0;  // Default to 0 if no average
                                    const countNote = result[0].count_note || 0; // Default to 0 if no count
                                    mostLikedGamesAverage.push({ avgNote, countNote });
                                    resolve();
                                }
                            });
                        });
                    });

                    // Attendre que toutes les requêtes soient terminées
                    Promise.all(mostLikedGamesPromises).then(() => {
                        res.render('accueil', { user, gamesRecentlyAdded, gamesMostLiked, recentlyAddedGamesAverage, mostLikedGamesAverage });
                    }).catch(err => {
                        console.error("Erreur lors du remplissage de recentlyAddedGames :", err);
                    });
                });
            }).catch(err => {
                console.error("Erreur lors du remplissage de recentlyAddedGames :", err);
            });
        });
    }
};