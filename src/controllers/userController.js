const express = require('express')
const authorize = require('../middleware/authorize')
const { populateLocals } = require('../utils')
/**
 *
 * @param {import('express').Application} app
 */
module.exports = function (app) {
  const router = express.Router()

  router.get('/home', (req, res) => {
    populateLocals(req, res)
    res.render('user/home')
  })

  app.use('/user', authorize(), router)
}
