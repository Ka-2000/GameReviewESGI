var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'esgi_game', 
    password: '',  
    database: 'test_bdd_projet' 
});
conn.connect(function (err) {
    if (err) throw err;
    console.log('-----------------------------------Connexion à la base de donnée réussis !-----------------------------------');
});
module.exports = conn;