var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'esgi_game', 
    database: 'test_bdd_projet', 
    password:'esgigame'
});
conn.connect(function (err) {
    if (err) throw err;
    console.log('-----------------------------------Connexion à la base de donnée réussis !-----------------------------------');
});
module.exports = conn;