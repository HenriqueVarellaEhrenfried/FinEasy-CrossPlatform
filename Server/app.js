var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var app = express();
var bd = require('./config.js');
var bcrypt = require('bcryptjs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

bd.client.connect();

function runQuery(req, res, qr){
	var qry = bd.client.query(qr).then(function(result){
		res.send(result.rows);
	},
	function(error){
		console.log(error);
	});
}

 function cryptPassword(password) {
   var salt = bcrypt.genSaltSync(10);
   var hash = bcrypt.hashSync(password, salt);
   return hash
};
//This should be done in client 
// function comparePassword(password) {
//     return bcrypt.compareSync(password, hash_from_db);
// });
//-------------------------------------
//===Create account===
/*
    The client should pass a JSON equal to:
    {
        "email":"algo@algo2.com",
        "password":"123",
        "name":"Fulano de Tal",
        "currency":"R$"
    }
*/

app.post('/newAccount', upload.array(), function(req, res){
	console.log(req.body);
	var sql = req.body;
    var encrypted_password = cryptPassword(sql.password);
    var currentdate = new Date(); 
    var datetime =  currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();
    console.log("LOG>>",encrypted_password)
	var text1 = "INSERT INTO Logins (email, encrypted_password) VALUES (" + "'" + sql.email + "'" + "," + encrypted_password + ");"
    var text2 = "INSERT INTO Users (name, defaultCurrency, lastModified, userCreationDate) VALUES ( " + "'" + sql.name + "'" + "," + "'" + 
                sql.currency + "'" + "," + "'" + datetime + "'" + "," + "'" + datetime + "'" + ");"
    var text = text1 + " " + text2;
	console.log(text)
	runQuery(req,res,text);
});
//=====
app.get('/getEncPassword/:pass', function (req, res) {
	runQuery(req, res, 'SELECT encrypted_password FROM Logins WHERE email = ' + req.params.score)
});





