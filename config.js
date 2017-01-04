var config = {
    development: {
        MAIL_USR: 'info@mobileonecontainers.com',
        MAIL_PASS: 'ElMundoGira2012!',
        PUBLIC_PATH: 'public/app',
        DB_URL: 'localhost:27017/JarturaExpress',
        SERVER_URL: 'http://localhost:8083',
        APP_PORT: process.env.PORT || 8083
    },
    production: {
        MAIL_USR: 'info@mobileonecontainers.com',
        MAIL_PASS: 'ElMundoGira2012!',
        PUBLIC_PATH: 'public/app',
        DB_URL: 'localhost:27017/JarturaExpress',
        SERVER_URL: 'http://localhost:8083',
        APP_PORT: process.env.PORT || 8083
    }
};

var mode = '';

function init(app) {
    mode = app.get('env');
    console.log('Enviroment: ', mode);
    return config[mode];
}

function getEnv() {
    return config[mode];
}
exports.getEnv = getEnv;
exports.init = init;
