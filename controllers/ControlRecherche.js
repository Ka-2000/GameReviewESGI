var modelRecherche = require('../models/ModelRecherche');
module.exports = {
    
    // affichage recherche avec les jeux filtrés
    afficher_recherche: function (req, res) {
        modelRecherche.afficher_recherche(function (data, data2, data3) {
            // chart stock
            var lesJeux = []
            var lesDonnesMeds = []
            for (let i = 0; i < data3.length; i++) {
                lesMeds.push(data3[i].Medicaments_libelle)
                lesDonnesMeds.push(data3[i].Medicaments_qte)
            }
            
           
                
                res.render('./recherche', { lesMeds, lesStockEffectif: JSON.stringify(lesStockEffectif), lesStock, test, lesPath: lesPath, lesDonnesPaths: JSON.stringify(lesDonnesPaths), prochainMois: prochainMois, prochainMoisEnNombre: JSON.stringify(prochainMoisEnNombre), lesMeds: lesMeds, lesDonnesMeds: JSON.stringify(lesDonnesMeds), contenu: data3, titre: "Liste des clients" })
        });
    }
    
}