var nodemailer = require('nodemailer');
var md5 = require('MD5');
var fs = require('fs');
var smtpTransport;
var urlServer;
var mailOptions = {};
var q = require('q');
var config; 
var moment = require('moment');

var bringTemplateData = function (url) {
	var deferred = q.defer();
	var daUrl = __dirname + '/emailtemplates/' + url;
	fs.readFile(daUrl, function (err, data) {
		if (err) {
			deferred.reject(err);
			return;
		}
		deferred.resolve(data.toString());
	});
	return deferred.promise;
};

var init = function (conf) {
	var smtpConfig = {
		host : 'cp21.grupo.host',
		port : 465,
		secure : true, // use SSL
		auth : {
			user : conf.MAIL_USR,
			pass : conf.MAIL_PASS
		}
	};
	urlServer = conf.SERVER_URL;
	smtpTransport = nodemailer.createTransport(smtpConfig);
	mailOptions.from = 'JarturaExpress <' + conf.MAIL_USR + '>';
	config = conf;
};

var setAttachment = function (url, fileName) {
	var thisAttachs = [];
	var attach = {
	    path: url,
	    filename: fileName,
	    contents: fs.readFileSync(url)
  	};
  	thisAttachs.push(attach);
 	return thisAttachs;
}

var sendMail = function (to, subject, body, isHtmlBody, attachments, cc, cco) {
	var deferred = q.defer();
	mailOptions.to = to;
	mailOptions.cc = cc ? cc : '';
	mailOptions.cco = cco ? cco : '';
	mailOptions.subject = subject;
	if (isHtmlBody) {
		mailOptions.html = body;
	} else {
		mailOptions.text = body;
	}
	if (attachments != undefined)
		mailOptions.attachments = attachments;
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
			deferred.reject(error);
		} else {
			console.log('Message sent');
			deferred.resolve(response);
		}
		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	});
	return deferred.promise;
};

var sendForgotPasswordMail = function (to, link, urlServer) {
	var deferred = q.defer();
	bringTemplateData('changePassword.html')
	.then(function (body) {
		var url = urlServer + '/changepassword/' + link;
		body = body.replace('<emailUrl>', url);
		console.log('sending mail')
		return sendMail(to, 'JarturaExpres | ¿Olvidó su contraseña?', body, true);
	})
	.then(function (response) {
		console.log('DONE Sending Mail: ', response)
		deferred.resolve(response);
	})
	.catch(function (err) {
		console.log('error', err)
		deferred.reject(err);
	});
	return deferred.promise;
};

var sendActivationEmail = function (email) {
	var d = q.defer();
	var token = md5(Date() + email);
	bringTemplateData('activateUser.html')
	.then(function (body) {
		var urlEmail = urlServer + '/user/confirm/' + token;
		body = body.replace('<emailUrl>', urlEmail);
		var attachments = [{
	      cid: 'Logo@app',
	      path: urlServer + '/images/logos/yellowLogo.png',
	      filename: 'yellowLogo.png',
	      contents: fs.readFileSync('images/logos/yellowLogo.png')
	  	}];
		console.log('sending mail');
		return sendMail(email, 'JarturaExpres | Bienvenido, activa tu cuenta!', body, true, attachments);
	})
	.then(function (response) {
		console.log('DONE Sending Mail: ', response);
		d.resolve(token);
	})
	.catch(function (err) {
		console.log('error', err)
		d.reject(err);
	});
	return d.promise;
};

exports.init = init;
exports.sendMail = sendMail;
exports.sendActivationEmail = sendActivationEmail;
exports.sendForgotPasswordMail = sendForgotPasswordMail;
