//@ts-check
const express = require('express')
const authorize = require('../middleware/authorize')
const { populateLocals } = require('../utils')

module.exports = function (app) {
  const router = express.Router()
  router.get('/', (req, res) => {
    //@ts-ignore
    if (req.user) {
      //@ts-ignore
      if (req.user.role == 'admin') {
        res.redirect('/admin/home')
        return
        //@ts-ignore
      } else if (req.user.role == 'user') {
        res.redirect('/user/home')
        return
      } else {
        res.redirect('/landing')
        return
      }
    } else {
      //@ts-ignore
      res.redirect('/landing')
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
  router.get('/landing', (req, res) => {
    populateLocals(req, res)
    res.render('landing')
  })
  router.get('/profile', authorize(), (req, res) => {
    populateLocals(req, res)
    res.render('profile')
  })

  app.use('/', router)
}
