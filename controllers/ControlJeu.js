var bd = require('../connexion/loading'); // DB connection

module.exports = {
    afficher_infosJeu: function (req, res) {
        const gameId = req.params.id; // Get game_id from the url

        // Request to get all data of a game by game_id
        const getGameDataQuery = `
            SELECT *
            FROM jeux
            WHERE ID_jeu = ?
        `;

        const user = req.session.user; // Get the user from the session
        try {
            bd.query(getGameDataQuery, [gameId], function (err, getGameResult) {
                if (err) {
                    console.error("Get game data SQL error :", err); // Display the SQL error in console
                }

                if (!getGameResult || getGameResult.length === 0) {
                    return res.status(404).send('Jeu non trouvé');
                }

                const gameData = getGameResult[0];
                const cover_url = gameData.url_image_jeu;
                const titre = gameData.titre;
                const date_sortie = gameData.date_de_sortie;
                const game_description = gameData.description;

                if (gameData) {
                    // Request to get all device of a game
                    const getAvailableDeviceGameQuery = `
                        SELECT
                            p.ID_plateforme,
                            p.nom_plateforme 
                        FROM plateformes p
                            LEFT JOIN jeu_plateforme jp ON jp.ID_plateforme = p.ID_plateforme
                        WHERE jp.ID_jeu = ?;
                    `;
                    bd.query(getAvailableDeviceGameQuery, [gameId], function (err, getDeviceResult) {
                        if (err) {
                            console.error("Get device data SQL error :", err); // Display the SQL error in console
                        }
                        const availableDevice = getDeviceResult;
                        
                        const getReviewOfGameQuery = `
                            SELECT
                                c.ID_commentaire,
                                c.avis_user,
                                c.note_user,
                                u.pseudo_user,
                                u.url_image_user
                            FROM jeu_commentaires jc
                                LEFT JOIN commentaires c ON c.ID_commentaire = jc.ID_commentaire
                                LEFT JOIN utilisateur_commentaires uc ON uc.ID_commentaire = c.ID_commentaire
                                LEFT JOIN utilisateur u ON u.ID_user = uc.ID_user
                            WHERE jc.ID_jeu = ?;
                        `;
                        bd.query(getReviewOfGameQuery, [gameId], function (err, getReviewResult) {
                            if (err) {
                                console.error("Get review data SQL error :", err); // Display the SQL error in console
                            }
                            const reviews = getReviewResult;
                            const nb_reviews = getReviewResult.length;

                            const date = new Date(date_sortie);
                            const formattedDate = date.toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });

                            const getReviewAverage = `
                                SELECT AVG(note_user)
                                FROM commentaires c
                                LEFT JOIN jeu_commentaires jc ON jc.ID_commentaire = c.ID_commentaire
                                WHERE jc.ID_jeu = ?; 
                            `;
                            bd.query(getReviewAverage, [gameId], function (err, getReviewAverageResult) {
                                if (err) {
                                    console.error("Get average review data SQL error :", err); // Display the SQL error in console
                                }
                                const reviewAverage = getReviewAverageResult[0]["AVG(note_user)"];

                                const getGameWithSameCategoryQuery = `
                                    SELECT
                                        j.*
                                    FROM jeu_categorie jc
                                    LEFT JOIN jeux j ON j.ID_jeu = jc.ID_jeu
                                    WHERE ID_categorie IN (
                                        SELECT ID_categorie
                                        FROM jeu_categorie
                                        WHERE ID_jeu = ?
                                    )
                                    AND jc.ID_jeu != ?
                                    LIMIT 4; ;
                                `;
                                bd.query(getGameWithSameCategoryQuery, [gameId, gameId], function (err, getGamesWithSameCategoryResult) {
                                    if (err) {
                                        console.error("Get review data SQL error :", err); // Display the SQL error in console
                                    }
                                    const otherGames = getGamesWithSameCategoryResult;

                                    var reviewOtherGame = [];
                                    var otherGamePromises = otherGames.map(otherGame => {
                                        const currentIdGame = otherGame.ID_jeu;
                                        const getOtherGameReview = `
                                            SELECT AVG(note_user) AS avg_note, COUNT(note_user) AS count_note
                                            FROM commentaires c
                                            LEFT JOIN jeu_commentaires jc ON jc.ID_commentaire = c.ID_commentaire
                                            WHERE jc.ID_jeu = ?;
                                        `;
                                    
                                        return new Promise((resolve, reject) => {
                                            bd.query(getOtherGameReview, [currentIdGame], function (err, result) {
                                                if (err) {
                                                    console.error("Get review data SQL error:", err);
                                                    reject(err);
                                                } else {
                                                    const avgNote = result[0].avg_note || 0;  // Default to 0 if no average
                                                    const countNote = result[0].count_note || 0; // Default to 0 if no count
                                                    reviewOtherGame.push({ avgNote, countNote });
                                                    resolve();
                                                }
                                            });
                                        });
                                    });
                                    
                                    // Attendre que toutes les requêtes soient terminées
                                    Promise.all(otherGamePromises).then(() => {
                                        res.render('jeu', {
                                            user,
                                            cover_url,
                                            titre,
                                            reviewAverage,
                                            nb_reviews,
                                            date_sortie: formattedDate,
                                            game_description,
                                            availableDevice,
                                            reviews,
                                            otherGames,
                                            reviewOtherGame,
                                            id: gameId // Pass the game ID here
                                        });
                                        
                                    }).catch(err => {
                                        console.error("Erreur lors du remplissage de reviewOtherGame :", err);
                                    });

                                    
                                });
                            });
                        });
                    });
                } else {
                    res.status(404).send('Jeu non trouvé');
                }
            });
        } catch (error) {
            console.error("Erreur inattendue:", error.message);  // Affiche toute autre erreur
            res.status(500).send("Une erreur inattendue s'est produite.");
        }
    }
};