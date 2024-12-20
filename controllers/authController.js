const sha256 = require('sha256');
// controllers/authController.js
const db = require('../connexion/loading'); // Importer la connexion à la base de données

exports.login = (req, res) => {
    const { username } = req.body;
    let { password } = req.body;
    // decrypt the password sha256
    const sha256 = require('sha256');
    password = sha256(password);


    // Log les valeurs reçues pour vérifier qu'elles sont correctes
    console.log("Tentative de connexion:", { username, password }); 

    const query_id = 'SELECT ID_user FROM utilisateur WHERE pseudo_user = ? AND mdp_user = ?';

    // First query to get ID_user
    db.query(query_id, [username, password], (error, results) => {
        if (error) {
            console.error("Erreur de la base de données:", error);
            return res.status(500).json({ message: 'Database error', error });
        }
    
        console.log("Résultats de la requête:", results);
    
        if (results.length > 0) {
            const ID_user = results[0].ID_user;

            // Second query to get the number of comments (nb_avis)
            const query1 = 'SELECT COUNT(*) as nb_avis FROM utilisateur_commentaires WHERE ID_user = ?';
    
            db.query(query1, [ID_user], (error, results) => {
                if (error) {
                    console.error("Erreur de la base de données:", error);
                    return res.status(500).json({ message: 'Database error', error });
                }

                const nb_avis = results[0].nb_avis;
                console.log("Nombre d'avis de l'utilisateur:", nb_avis);
    
                // Now run the third query to fetch the user's details
                const query2 = 'SELECT * FROM utilisateur WHERE pseudo_user = ? AND mdp_user = ?';
    
                console.log("Exécution de la requête SQL:", query2, [username, password]);

                db.query(query2, [username, password], (error, results) => {
                    if (error) {
                        console.error("Erreur de la base de données:", error); 
                        return res.status(500).json({ message: 'Database error', error });
                    }
    
                    console.log("Résultats de la requête:", results);
    
                    if (results.length > 0) {
                        // Authentification réussie
                        const ID_user = results[0].ID_user;
                        const mdp_user = results[0].mdp_user;
                        const mail_user = results[0].mail_user;
                        const url_image_user = results[0].url_image_user;
                        const is_admin = results[0].is_admin;
    
                        // Créez une session utilisateur pour stocker les informations de l'utilisateur
                        req.session.user = { 
                            ID_user,
                            username, 
                            is_connected: true,
                            mdp_user,
                            mail_user,
                            url_image_user,
                            is_admin,
                            nb_avis // Include nb_avis in the session
                        };

                        console.log(`Session créée pour l'utilisateur : ${username}`);
                        return res.status(200).json({ message: 'Utilisateur authentifié !' });
                    } else {
                        // Authentification échouée
                        return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
                    }
                });
            });
        } else {
            return res.status(404).json({ message: 'Utilisateur introuvable.' });
        }
    });
};


exports.register = (req, res) => {
    const { pseudo_user, mail_user, url_image_user, is_admin } = req.body;
    let { mdp_user } = req.body; // Use let here if you plan to reassign

    // Hash the password
    mdp_user = sha256(mdp_user);

    const query = 'INSERT INTO utilisateur (pseudo_user, mdp_user, mail_user, url_image_user, is_admin) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [pseudo_user, mdp_user, mail_user, url_image_user, is_admin], (error, results) => {
        if (error) {
            console.error("Erreur lors de l'inscription:", error);
            return res.render('register', { message: 'Erreur de base de données' });
        }

        return res.render('register', { message: 'Inscription réussie !' });
    });
};

exports.delete_account = (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.redirect('/connexion');
    }

    const query = "DELETE FROM utilisateur WHERE ID_user = ?";
    db.query(query, [user.ID_user], (error, results) => {
        if (error) {
            console.error("Erreur lors de la suppression de l'utilisateur:", error);
            return res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
        }

        console.log("Utilisateur supprimé avec succès:", results);
        //print query with the user ID
        console.log("Requête SQL:", query, [user.ID_user]);

        // Déconnectez l'utilisateur en supprimant la session
        req.session.destroy();

        return res.redirect('/connexion');
    });
};

exports.submit_review = (req, res, id) => {
    
    // Récupérer la session utilisateur
    const user = req.session.user;

    if (!user) {
        return res.redirect('/connexion');
    }

    const { avis_user, note_user } = req.body; // Doit correspondre aux noms des champs du formulaire

    // Vérifier si l'utilisateur a déjà laissé un avis pour ce jeu
    const checkQuery = 'SELECT * FROM utilisateur_commentaires uc JOIN jeu_commentaires jc ON uc.ID_commentaire = jc.ID_commentaire WHERE uc.ID_user = ? AND jc.ID_jeu = ?';
    
    db.query(checkQuery, [user.ID_user, id], (error, results) => {
        if (error) {
            console.error("Erreur lors de la vérification de l'avis:", error);
            return res.status(500).send("Erreur lors de la vérification de l'avis");
        }

        // Si un avis existe, ne pas autoriser l'ajout
        if (results.length > 0) {
            return res.status(403).send("Vous avez déjà laissé un avis pour ce jeu.");
        }

        // Aucun avis trouvé, procéder à l'ajout de l'avis
        let ID_commentaire = 0;
        const insertCommentQuery = 'INSERT INTO commentaires (ID_commentaire, avis_user, note_user) VALUES (?, ?, ?)';
        
        db.query(insertCommentQuery, [ID_commentaire, avis_user, note_user], (error, results) => {
            if (error) {
                console.error("Erreur lors de l'ajout de l'avis:", error);
                return res.status(500).send("Erreur lors de l'ajout de l'avis");
            }

            console.log("Avis ajouté avec succès:", results);
            ID_commentaire = results.insertId;

            const linkUserCommentQuery = 'INSERT INTO utilisateur_commentaires (ID_utilisateur_commentaires, ID_user, ID_commentaire) VALUES (?, ?, ?)';
            
            db.query(linkUserCommentQuery, [null, user.ID_user, ID_commentaire], (error, results) => {
                if (error) {
                    console.error("Erreur lors de l'ajout de l'avis utilisateur:", error);
                    return res.status(500).send("Erreur lors de l'ajout de l'avis utilisateur");
                }

                console.log("Avis utilisateur ajouté avec succès:", results);

                // Associer le commentaire avec le jeu
                const linkGameCommentQuery = 'INSERT INTO jeu_commentaires (ID_jeu_commentaire, ID_jeu, ID_commentaire) VALUES (?, ?, ?)';
                
                db.query(linkGameCommentQuery, [null, id, ID_commentaire], (error, results) => {
                    if (error) {
                        console.error("Erreur lors de l'ajout de l'avis pour le jeu:", error);
                        return res.status(500).send("Erreur lors de l'ajout de l'avis pour le jeu");
                    }

                    console.log("Avis pour le jeu ajouté avec succès:", results);
                    return res.redirect('/jeu/' + id);
                });
            });
        });
    });
};

