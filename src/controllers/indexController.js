//@ts-check
const express = require('express')
const authorize = require('../middleware/authorize')
const { isLoggedIn, populateLocals } = require('../utils')

module.exports = function (app) {
  const router = express.Router()
  router.get('/', (req, res) => {
    //@ts-ignore
    if (req.user) {
      res.redirect('/home')
      return
    } else {
      //@ts-ignore
      req.flash('errorMessages', 'please login to continue')
      res.redirect('/login')
      return
    }
  })
  router.get('/login', (req, res) => {
    populateLocals(req, res)
    res.render('login')
  })
  router.get('/signup', (req, res) => {
    populateLocals(req, res)
    res.render('signup')
  })
  router.get('/home', authorize(), (req, res) => {
    populateLocals(req, res)
    res.render('home')
  })
  router.get('/profile', authorize(), (req, res) => {
    populateLocals(req, res)
    res.render('profile')
  })
  router.get(
    '/admin',
    authorize({
      allowedRoles: ['admin'],
    }),
    (req, res) => {
      populateLocals(req, res)
      res.render('admin')
    }
  )
  app.use('/', router)
}
