const express = require('express')
const { body, validationResult } = require('express-validator')
const catchAsync = require('../utils/catchAsync')
const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const upload = require('../setup/upload')
const extractErrorMessage = require('../utils/extractErrorMessage')

module.exports = function (app) {
  const router = express.Router()

  router.post(
    '/signup',
    upload.single('profile_picture'),
    body('username')
      .isString()
      .isLength({ min: 4 })
      .withMessage('must have at least 4 letters'),
    body('password')
      .isString()
      .isLength({ min: 8 })
      .withMessage('must have at least 8 letters'),
    catchAsync(async (req, res) => {
      //validation
      const message = extractErrorMessage(req)
      if (message) {
        req.flash('errorMessages', message)
        res.redirect('/signup')
        return
      }
      if (!req.file) {
        req.flash('errorMessages', 'please upload profile picture')
        res.redirect('/signup')
        return
      }
      //logic
      const { username, password } = req.body
      const profileFileName = req.file.filename
      const profileUrl = `/uploads/${profileFileName}`
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        req.flash('errorMessages', 'username already exists')
        res.redirect('/signup')
        return
      }
      const salt = bcryptjs.genSaltSync(10)
      const hash = bcryptjs.hashSync(password, salt)
      await User.create({ username, password: hash, profileUrl: profileUrl })
      req.flash('successMessages', 'Signup successful')
      res.redirect('/login')
      return
    })
  )

  router.post(
    '/login',
    body('username').isString(),
    body('password').isString(),
    catchAsync(async (req, res) => {
      //validation
      const message = extractErrorMessage(req)
      if (message) {
        req.flash('errorMessages', message)
        res.redirect('/login')
        return
      }
      //logic
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        req.flash('errorMessages', 'username does not exist')
        res.redirect('/login')
        return
      }
      const hash = user.password
      const isValid = bcryptjs.compareSync(password, hash)
      if (!isValid) {
        req.flash('errorMessages', 'password is not correct')
        res.redirect('/login')
        return
      }
      // req.session.userId = user.id
      req.session.user = user
      req.flash('successMessages', 'Login success')
      res.redirect('/')
    })
  )

  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  })

  app.use('/auth', router)
}
