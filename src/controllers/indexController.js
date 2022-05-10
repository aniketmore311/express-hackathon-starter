//@ts-check
const express = require('express')
const authenticate = require('../middleware/authenticate')
const preventAuth = require('../middleware/blockAuthenticated')
const populateLocals = require('../utils/populateLocals')

/**
 * @param {import("express").Application} app
 */
module.exports = function (app) {
  const router = express.Router()
  router.get('/', (req, res) => {
    //@ts-ignore
    const user = req.session.user
    if (user) {
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
  app.use('/', router)
}
