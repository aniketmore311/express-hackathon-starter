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
    res.render('admin/home')
  })

  app.use(
    '/admin',
    authorize({
      allowedRoles: ['admin'],
    }),
    router
  )
}
