var User = require('../dal/user');
var q = require('q');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

function UserHandler(db, secret, mail){
	this.secret = secret;
	this.db = db;
	this.mail = mail;
	this.User = db.model('User', db.Schema(User.schema));
}

UserHandler.prototype.encryptPassword = function (password) {
	var salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password + this.secret, salt);
};

UserHandler.prototype.getMiniUser = function (user) {
	var miniUser = {
		_id : user._id,
		role : {
			_id: user.role._id
		},
		fullName : user.firstName + ' ' + user.lastName,
		status: {
			_id: user.status._id
		}
	};
	return miniUser;
};

UserHandler.prototype.login = function(email, password){
	var _this = this;
	var d = q.defer();
	_this.User.find({ 'account.email': email })
	.then(function(result){
		if (result.length <= 0) {
			throw 'Este usuario no existe en nuestra base de datos. Favor chequear si escribió bien el correo.';
		}
		var user = result[0];
		if(!bcrypt.compareSync(password + _this.secret, user.account.password)){
			throw 'La contraseña y el correo no coinciden con nuestros datos. Favor chequear si lo escribió bien.';
		}
		if (user.status._id == 2) {
			throw 'El usuario no está activo';
		}
		return user;
	})
	.then(function(user){
		var token = jwt.sign(_this.getMiniUser(user), _this.secret, {
			expiresIn : '60m'
		});
		d.resolve({
			data : user,
			token : token
		});
	})
	.catch (function (error) {
		d.reject({
			msg : error.toString()
		});
	});
	return d.promise;
};

UserHandler.prototype.actual = function(id){
	var _this = this;
	var d = q.defer();
	_this.User.find({ _id: id })
	.then(function(result){
		if (result.length <= 0) {
			throw 'El usuario no existe';
		}
		var user = result[0];
		if (user.status._id == 2) {
			throw 'El usuario no está activo';
		}
		d.resolve({
			data : user
		});
	})
	.catch (function (error) {
		console.log(error)
		d.reject({
			msg : error.toString()
		});
	});
	return d.promise;
};

UserHandler.prototype.register = function(user){
	var _this = this;
	var d = q.defer();
	var userx = {};
	_this.User.find({ 'account.email': user.account.email })
	.then(function(result){
		if (result.length > 0) {
			throw 'El usuario ya existe. Favor usar otro correo.';
		}
		user.status = {
			_id: 2,
			description: 'Inactivo'
		};
		return new _this.User(user).save();
	})
	.then(function(result){
		userx = result;
		return _this.mail.sendActivationEmail(result.account.email);
	})
	.then(function(token){
		userx.confirmToken = token;
		return new _this.User(userx).save();
	})
	.then(function(result){
		d.resolve({
			data : result
		});
	})
	.catch (function (error) {
		d.reject({
			msg : error.toString(),
			error: error
		});
	});
	return d.promise;
};

UserHandler.prototype.confirm = function(token){
	var _this = this;
	var d = q.defer();
	_this.User.find({ confirmToken: token })
	.then(function(result){
		if (result.length <= 0) {
			throw 'El usuario no existe.';
		}
		var user = result[0];
		user.status = {
			_id: 1,
			description: 'Activo'
		};
		return new _this.User(user).save();
	})
	.then(function(result){
		d.resolve({
			data : result
		});
	})
	.catch (function (error) {
		d.reject({
			msg : error.toString(),
			error: error
		});
	});
	return d.promise;	
};

module.exports = UserHandler;