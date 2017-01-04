//config
var express = require('express');
var app = express();
var config = require('./config').init(app);
//mail
var mail = require('./api/bll/mail');
mail.init(config);
//http declaration
var http = require('http');
var path = require('path');
var validator = require('express-validator');
var bodyParser = require('body-parser');
//express declaration
var secret = "ElMundoDeberiaGirarSiempre2017!";
var auth = require('express-jwt');
//express configuration
app.use('/api', auth({
	secret: secret
}));
app.use(bodyParser.json({
	limit : '100mb'
}));
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(validator());
app.use('/', express.static(path.join(__dirname, config.PUBLIC_PATH)));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/images/logos', express.static(path.join(__dirname, 'images/logos')));
//database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' + config.DB_URL);
var db = mongoose.connection;
db.on('error', function(error){
	console.log({ 
		msg: 'Error en la base de datos',
		error: error
	});
});
//routes config
db.once('open', function() {
	app.db = mongoose;
	require('./api/ws/user')('/api/user', app, secret, mail);
});
//http configuration
http.createServer(app)
.listen(config.APP_PORT, function () {
	console.log("[*] Server Listening on port %d", config.APP_PORT);
});