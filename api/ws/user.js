var q = require('q');
var UserHandler = require('../bll/userHandler');
var User = require('../dal/user');
var util = require('../bll/util');


module.exports = function (prefix, app, secret, mail) {
	var userHandler = new UserHandler(app.db, secret, mail);
	//Login
	app.post('/user/login', function (req, res) {
		req.checkBody(User.loginValidation);
		util.validate(req, res)
		.then(function(){
			userHandler.login(req.body.email, req.body.password)
			.then(util.success(res), util.error(res));
		});
	});
	//actual
	app.get(prefix, function(req, res){
		if(!req.user){
			res.status(401).json({ msg: 'No esta autorizado para esta solicitud' });
		}
		else {
			userHandler.actual(req.user._id)
			.then(util.success(res), util.error(res));
		}
	});
	//register
	app.post('/user/register', function(req, res){
		req.checkBody(User.validation);
		util.validate(req, res)
		.then(function(){
			userHandler.register(req.body)
			.then(util.success(res), util.error(res));
		});
	});
};
