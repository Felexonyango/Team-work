var dotenv = require('dotenv')
dotenv.config()
require('process')

var config = {};

config.DB = "" + process.env.DB




module.exports = config;