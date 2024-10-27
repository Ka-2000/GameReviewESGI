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
                            const nb_avis = getReviewResult.length;

                            const date = new Date(date_sortie);
                            const formattedDate = date.toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            });
                            
                            res.render('jeu', {
                                cover_url,
                                titre,
                                nb_avis,
                                date_sortie: formattedDate,
                                game_description,
                                availableDevice,
                                reviews
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