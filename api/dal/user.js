exports.schema = {
	firstName: { type: String, required: true },
	lastName: { type: String, required: true }, 
	birthday: { type: Date, required: true },
	account: {
		email: { type: String, required: true, unique: true, lowercase: true, dropDups: true },
		password: { type: String, required: true }
	},
	phone: {
		phoneType: {
			_id: { type: Number, required: true },
			description: { type: String, required: true }
		},
		number: { type: String, required: true }
	},
	status: {
		_id: { type: Number, required: true },
		description: { type: String, required: true }
	},
	role : {
		_id: { type: Number, required: true },
		description: { type: String, required: true }
	},
	confirmToken: String
};
exports.validation = {
	firstName: {
		notEmpty: true,
		errorMessage: 'El nombre es requerido'
	},
	lastName: {
		notEmpty: true,
		errorMessage: 'El apellido es requerido'
	},
	birthday: {
		notEmpty: true,
		errorMessage: 'La Fecha de cumpleaños es requerida',
		isDate: {
			errorMessage: 'Fecha de cumpleaños es inválida'
		}
	},
	'account.email' : {
		notEmpty: true,
		errorMessage: 'Correo requerido',
		isEmail: {
			errorMessage: 'Correo Inválido'
		}
	},
	'account.password': {
		notEmpty: true,
		errorMessage: 'Contraseña requerida',
		isLength: {
	      options: [{ min: 8 }],
	      errorMessage: 'La contraseña debe ser mínimo 8 caracteres'
	    }
	},
	'phone.phoneType' : {
		notEmpty: true,
		errorMessage: 'Tipo de teléfono requerido'
	},
	'phone.number' : {
		notEmpty: true,
		errorMessage: 'Número de telefono requerido'
	},
	'status': {
		notEmpty: true,
		errorMessage: 'El estatus es requerido'
	},
	'role' : {
		notEmpty: true,
		errorMessage: 'El rol es requerido'
	}
};
exports.loginValidation = {
	email : {
		notEmpty: true,
		errorMessage: 'Correo requerido',
		isEmail: {
			errorMessage: 'Correo Inválido'
		}
	},
	password: {
		notEmpty: true,
		errorMessage: 'Contraseña requerida'
	}
};