//@ts-check
const express = require('express')
const { body } = require('express-validator')
const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const upload = require('../setup/upload')
const { sendEmail } = require('../services/emailService')
const configService = require('../config/configService')
const { catchAsync, extractErrorMessage } = require('../utils')

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
    body('email').isString(),
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
      const { username, password, email } = req.body
      const profileFileName = req.file.filename
      const profileImageUrl = `/uploads/${profileFileName}`
      const existingUser = await User.findOne({ username })
      if (existingUser) {
        req.flash('errorMessages', 'username already exists')
        res.redirect('/signup')
        return
      }
      const existingByEmail = await User.findOne({ email: email })
      if (existingByEmail) {
        req.flash('errorMessages', 'email already exists')
        res.redirect('/signup')
        return
      }
      const salt = bcryptjs.genSaltSync(10)
      const hash = bcryptjs.hashSync(password, salt)
      const user = await User.create({
        username,
        password: hash,
        email,
        profileImageUrl: profileImageUrl,
      })
      //send email
      const serverUrl = configService.getConfig('SERVER_URL')
      const outlookEmail = configService.getConfig('OUTLOOK_EMAIL')
      await sendEmail({
        from: `john <${outlookEmail}>`,
        to: email,
        subject: 'verify your email',
        text: `verify your email by clicking the link below\n ${serverUrl}/auth/verify_email/${email}/${user.verificationCode}`,
        html: `verify your email by clicking the link below\n ${serverUrl}/auth/verify_email/${email}/${user.verificationCode}`,
      })
      req.flash(
        'successMessages',
        'Signup successful, confirm your email to login'
      )
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
      if (!user.isEmailVerified) {
        req.flash('errorMessages', 'please verify your email')
        res.redirect('/login')
        return
      }
      //@ts-ignore
      req.session.user = user
      req.flash('successMessages', 'Login success')
      res.redirect('/')
    })
  )

  router.get('/verify_email/:email/:code', async (req, res) => {
    const { email, code } = req.params
    const user = await User.findOne({ email, verificationCode: code })
    if (!user) {
      req.flash('errorMessages', 'user does not exist')
      res.redirect('/login')
      return
    }
    if (user.isEmailVerified) {
      req.flash('errorMessages', 'email already verified')
      res.redirect('/login')
      return
    }
    if (user.verificationCode !== code) {
      req.flash('errorMessages', 'invalid verification code')
      res.redirect('/login')
      return
    }
    if (user.verificationCode === code) {
      user.isEmailVerified = true
      await user.save()
      req.flash('successMessages', 'email verified')
      res.redirect('/login')
      return
    }
  })

  router.get('/logout', (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login')
    })
  })

  app.use('/auth', router)
}
