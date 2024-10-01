var modelAccueil = require('../models/ModelAccueil');
module.exports = {
    
    // affichage accueil avec les différents charts (à prevoir, stock effectif et part pathologies)
    afficher_accueil: function (req, res) {
        modelAccueil.afficher_accueil(function (data, data2, data3) {
            // chart stock
            var lesMeds = []
            var lesDonnesMeds = []
            for (let i = 0; i < data3.length; i++) {
                lesMeds.push(data3[i].Medicaments_libelle)
                lesDonnesMeds.push(data3[i].Medicaments_qte)
            }
            
            // chart pathologies
            var lesPath = []
            var lesDonnesPaths = []
            for (let i = 0; i < data2.length; i++) {
                lesPath.push(data2[i].Pathologies_libelle)
                lesDonnesPaths.push(data2[i].total)
            }
            
            function daysInMonth(month, year) {
                return new Date(year, month, 0).getDate();
            }
            
            // chart stock a prevoir
            lesMois = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
            var d = new Date();
            var annee = d.getFullYear
            var prochainMois = [lesMois[d.getMonth()]]
            var prochainMoisEnNombre = [d.getMonth() + 1]
            var joursProchainsMoisEnnombre = [daysInMonth(d.getMonth() + 1, new Date().getFullYear())]
            for (let i = 0; i < 6; i++) {
                d.setMonth(d.getMonth() + 1);
                prochainMois.push(lesMois[d.getMonth()])
                prochainMoisEnNombre.push(d.getMonth() + 1)
                joursProchainsMoisEnnombre.push(daysInMonth(d.getMonth(), new Date().getFullYear()))
            }
            
            let test = []
            for (let i = 0; i < lesMeds.length; i++) {
                testArray = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20));
                test.push([testArray])
                test[i].push(lesMeds[i])
            }
            
            modelStock.afficher_liste_stocks(function (data, data2, data3) {
                lesStock = []
                for (i in data2) {
                    lesStock.push([data2[i].idMedicament, data2[i].Medicaments_libelle, data2[i].Medicaments_qte, data2[i].stock_necessaire])
                }
                
                for (i in data3) {
                    lesStock.push([data3[i].Medicaments_id, data3[i].Medicaments_libelle, data3[i].Medicaments_qte, 0])
                }
                
                for (i in data) {
                    lesStock[i][3] = lesStock[i][3] + data[i].stock_necessaire
                }
                lesMeds = []
                lesStockEffectif =  []
                for (i in lesStock){
                    lesMeds.push(lesStock[i][1])
                    lesStockEffectif.push(lesStock[i][2]-lesStock[i][3])
                }
                
                
                res.render('./accueil', { lesMeds, lesStockEffectif: JSON.stringify(lesStockEffectif), lesStock, test, lesPath: lesPath, lesDonnesPaths: JSON.stringify(lesDonnesPaths), prochainMois: prochainMois, prochainMoisEnNombre: JSON.stringify(prochainMoisEnNombre), lesMeds: lesMeds, lesDonnesMeds: JSON.stringify(lesDonnesMeds), contenu: data3, titre: "Liste des clients" })
            });
        });
    },
}