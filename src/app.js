//@ts-check
const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const errorhandler = require('errorhandler')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const hbs = require('hbs')

const configService = require('./config/configService')
const NODE_ENV = configService.getConfig('NODE_ENV')
const VIEWS_DIR = configService.getConfig('VIEWS_DIR')
const PARTIALS_DIR = configService.getConfig('PARTIALS_DIR')
const PUBLIC_DIR = configService.getConfig('PUBLIC_DIR')
const UPLOADS_DIR = configService.getConfig('UPLOADS_DIR')

const app = express()

// app configuration
app.set('view engine', 'hbs')
app.set('views', VIEWS_DIR)
hbs.registerPartials(PARTIALS_DIR, (err) => {
  if (err) {
    console.log(err)
  }
})

//middleware
//@ts-ignore
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: configService.getConfig('SECRET_KEY'),
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: configService.getConfig('MONGO_URI'),
    }),
  })
)
app.use(flash())
app.use('/public', express.static(PUBLIC_DIR))
app.use('/uploads', express.static(UPLOADS_DIR))

if (NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else if (NODE_ENV === 'production') {
  app.use(morgan('common'))
}

// register controllers
require('./controllers/indexController')(app)
require('./controllers/authController')(app)

//error handlers
app.use(notFoundHander())
app.use(errorLogger())
// app.use(errorHandler())
if (NODE_ENV == 'development') {
  app.use(errorhandler())
} else if (NODE_ENV == 'production') {
  app.use(prodErrorHandler())
}

//handlers
/**
 * @returns {import("express").RequestHandler}
 */
function notFoundHander() {
  return function (req, res) {
    res.status(404).render('404')
  }
}

/**
 * @returns {import("express").ErrorRequestHandler}
 */
function errorLogger() {
  return function (err, req, res, next) {
    console.error(err.stack)
    next(err)
  }
}

/**
 * @returns {import("express").ErrorRequestHandler}
 */
function prodErrorHandler() {
  //eslint-disable-next-line no-unused-vars
  return function (err, req, res, next) {
    res.render('500')
  }
}

module.exports = app
