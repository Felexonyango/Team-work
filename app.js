"use strict";

/** Dependency Injection */

require('dotenv/config') // npm  dotenv file
require('process')

var express = require('express') // $ npm install express
    ,
    path = require('path') // Node In-Build Module
    ,
    bodyParser = require('body-parser') // $ npm install body-parser
    ,
    session = require('express-session') // $ npm install express-session
    ,
    cookieParser = require('cookie-parser') // $ npm install cookie-parser
    ,
    passport = require('passport') // $ npm install passport
    ,
    mongoose = require('mongoose') // $ npm install mongoose
    ,
    validator = require('express-validator') // $ npm install express-validator
    ,
    CONFIG = require('./config/config') // Injecting Our Configuration
    ,
    favicon = require('serve-favicon') // $ npm install serve-favicon
    ,
    compression = require('compression'),
    url = require('url'),
    i18n = require("i18n"),
    flash = require('connect-flash')
    /** /Dependency Injection */

/** Socket.IO */
var app = express(); // Initializing ExpressJS
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var TestController = require("./controller/mobile/Test")
    /** /Socket.IO */

/** Global Configuration*/
global.GLOBAL_CONFIG = CONFIG.GLOBAL;

/** Middleware Configuration */

i18n.configure({ locales: ['en', 'ar'], defaultLocale: 'en', autoReload: true, directory: __dirname + '/uploads/locales', syncFiles: true });
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded
    //app.use(bodyParser.json({ limit: '100mb' })); // bodyParser - Initializing/Configuration
app.use(cookieParser('CasperonHandyforall')); // cookieParser - Initializing/Configuration cookie: {maxAge: 8000},
app.use(session({ secret: 'CasperonHandyforall', resave: true, saveUninitialized: true })); // express-session - Initializing/Configuration
app.use(validator())
app.use(flash()); // flash - Initializing
app.use(passport.initialize()); // passport - Initializing
app.use(passport.session()); // passport - User Session Initializing
app.use(compression()); //use compression middleware to compress and serve the static content.
app.use('/app', express.static(path.join(__dirname, '/app'), { maxAge: 7 * 86400000 })); // 1 day = 86400000 ms
app.use('/uploads', express.static(path.join(__dirname, '/uploads'), { maxAge: 7 * 86400000 }));
app.use(i18n.init);
app.set('view engine', 'pug');
app.locals.pretty = true;
app.set('views', './views');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    i18n.setLocale(req.headers["accept-language"] || 'en');
    next();
});
app.use("/Test", TestController);
/** /Middleware Configuration */

/** MongoDB Connection */
mongoose.connect(
        process.env.DB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
        })
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err));

/** Dependency Mapping */
require('./routes')(app, passport, io, i18n);
require('./sockets')(io);
require('./cron');
/** /Dependency Mapping*/

/** HTTP Server Instance */
try {
    server.listen(CONFIG.PORT, function() {
        console.log('Server turned on with', CONFIG.ENV, 'mode on port', CONFIG.PORT);
    });
} catch (ex) {
    console.log(ex);
}
/** /HTTP Server Instance */