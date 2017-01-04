var _ = require('underscore');
var q = require('q');

exports.success = function (res) {
	return function (f) {
		res.status(200).send(f);
	};
};

exports.error = function (res) {
	return function (f) {
		res.status(510).json(f);
	};
};

exports.validate = function(req, res){
	var d = q.defer();
	req.getValidationResult()
	.then(function(result) {
		var errors = result.array();
		if(errors.length > 0){
			var errorsString = _.reduce(errors, function(memo, value){
				return memo + ', ' + value.msg;
			}, '');
			res.status(510).json({
				msg: errorsString,
				errors: errors
			});
		}
		else {
			d.resolve(true);
		}
	});
	return d.promise;
};