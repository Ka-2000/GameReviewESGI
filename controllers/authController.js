// controllers/authController.js
const db = require('../connexion/loading'); // Importer la connexion à la base de données

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Log les valeurs reçues pour vérifier qu'elles sont correctes
    console.log("Tentative de connexion:", { username, password }); 

    const query = 'SELECT * FROM utilisateur WHERE pseudo_user = ? AND mdp_user = ?';
    
    // Log de la requête avant de l'exécuter
    console.log("Exécution de la requête SQL:", query, [username, password]);

    db.query(query, [username, password], (error, results) => {
        // Log d'erreur de base de données
        if (error) {
            console.error("Erreur de la base de données:", error); // Log l'erreur ici
            return res.status(500).json({ message: 'Database error', error });
        }

        // Log des résultats obtenus
        console.log("Résultats de la requête:", results);

        if (results.length > 0) {
            // Authentification réussie
            return res.status(200).json({ message: 'Utilisateur authentifié !' });
        } else {
            // Authentification échouée
            return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    });
};
