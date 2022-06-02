const express = require('express')
const authenticate = require('../middleware/authenticate')
const preventAuth = require('../middleware/blockAuthenticated')
const populateLocals = require('../utils/populateLocals')

module.exports = function (app) {
  const router = express.Router()
  router.get('/', (req, res) => {
    const userId = req.session.userId
    if (userId) {
      res.redirect('/home')
      return
    } else {
      req.flash('errorMessages', 'please login to continue')
      res.redirect('/login')
      return
    }
  })
  router.get('/login', preventAuth(), (req, res) => {
    populateLocals(req, res)
    res.render('login')
  })
  router.get('/signup', preventAuth(), (req, res) => {
    populateLocals(req, res)
    res.render('signup')
  })
  router.get('/home', authenticate(), (req, res) => {
    populateLocals(req, res)
    res.render('home')
  })
  router.get(
    '/admin',
    authenticate({
      allowedRoles: ['admin'],
    }),
    (req, res) => {
      populateLocals(req, res)
      res.render('admin')
    }
  )
  app.use('/', router)
}
