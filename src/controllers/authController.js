//@ts-check
const express = require('express')
const mongoose = require('mongoose')
const User = mongoose.models.User
const { body } = require('express-validator')
const bcryptjs = require('bcryptjs')
const configService = require('../config/configService')
const { catchAsync } = require('../utils')
const validate = require('../middleware/validate')
const {
  sendVerificationEmail,
  sendVerificationSMS,
} = require('../services/notificationService')

const SEND_EMAIL = configService.getConfig('SEND_EMAIL')
const SEND_SMS = configService.getConfig('SEND_SMS')

module.exports = function (app) {
  const router = express.Router()

  router.post(
    '/signup',
    body('email').isString().notEmpty(),
    body('password').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('phone_number')
      .isString()
      .isLength({ min: 13, max: 13 })
      .withMessage('must be 13 characters long'),
    validate({
      getRedirectUrl: () => '/signup',
    }),
    catchAsync(async (req, res) => {
      const { name, password, email, phone_number } = req.body
      /*
       */
      const existingByEmail = await User.findOne({ email: email })
      if (existingByEmail) {
        req.flash('errorMessages', 'email already exists')
        res.redirect('/signup')
        return
      }
      const existingByPhoneNumber = await User.findOne({
        phoneNumber: phone_number,
      })
      if (existingByPhoneNumber) {
        req.flash('errorMessages', 'phone number already exists')
        res.redirect('/signup')
        return
      }
      const salt = bcryptjs.genSaltSync(10)
      const hash = bcryptjs.hashSync(password, salt)
      const user = await User.create({
        name,
        password: hash,
        email,
        phoneNumber: phone_number,
      })
      //send email
      /*
       */
      if (SEND_EMAIL) {
        await sendVerificationEmail(email, user.emailVerificationCode)
      }
      if (SEND_SMS) {
        await sendVerificationSMS(phone_number, user.phoneVerificationCode)
      }
      req.flash(
        'successMessages',
        'Signup successful, confirm your email and phone number to login'
      )
      res.redirect('/login')
      return
    })
  )

  router.post(
    '/login',
    body('email').isString().notEmpty(),
    body('password').isString().notEmpty(),
    validate({
      getRedirectUrl: () => '/login',
    }),
    catchAsync(async (req, res) => {
      //logic
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        req.flash('errorMessages', 'email does not exist')
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
      if (!user.isPhoneVerified) {
        req.flash('errorMessages', 'please verify your phone number')
        res.redirect('/login')
        return
      }
      //@ts-ignore
      req.session.userId = user.id
      req.flash('successMessages', 'Login success')
      res.redirect('/')
    })
  )

  router.get(
    '/verify_email/:email/:code',
    catchAsync(async (req, res) => {
      const { email, code } = req.params
      const user = await User.findOne({ email })
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
      if (user.emailVerificationCode !== code) {
        req.flash('errorMessages', 'invalid verification code')
        res.redirect('/login')
        return
      }
      if (user.emailVerificationCode === code) {
        user.isEmailVerified = true
        await user.save()
        req.flash('successMessages', 'email verified')
        res.redirect('/login')
        return
      }
    })
  )

  router.get(
    '/verify_phone/:phone_number/:code',
    catchAsync(async (req, res) => {
      const { phone_number, code } = req.params
      const user = await User.findOne({ phoneNumber: phone_number })
      console.log(user.toObject())
      console.log(code)
      if (!user) {
        req.flash('errorMessages', 'user does not exist')
        res.redirect('/login')
        return
      }
      if (user.isPhoneVerified) {
        req.flash('errorMessages', 'phone number already verified')
        res.redirect('/login')
        return
      }
      if (user.phoneVerificationCode !== code) {
        req.flash('errorMessages', 'invalid verification code')
        res.redirect('/login')
        return
      }
      if (user.phoneVerificationCode === code) {
        user.isPhoneVerified = true
        await user.save()
        req.flash('successMessages', 'phone number verified')
        res.redirect('/login')
        return
      }
    })
  )

  router.get('/logout', (req, res) => {
    //@ts-ignore
    req.session.userId = null
    req.flash('successMessages', 'Logout success')
    res.redirect('/login')
  })

  app.use('/auth', router)
}
