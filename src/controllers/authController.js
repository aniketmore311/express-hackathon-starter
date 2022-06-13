//@ts-check
const express = require('express')
const mongoose = require('mongoose')
const User = mongoose.models.User
const { body } = require('express-validator')
const bcryptjs = require('bcryptjs')
const { sendEmail } = require('../services/emailService')
const configService = require('../config/configService')
const { catchAsync } = require('../utils')
const validate = require('../middleware/validate')

const SEND_EMAIL = configService.getConfig('SEND_EMAIL')

module.exports = function (app) {
  const router = express.Router()

  router.post(
    '/signup',
    body('email').isString().notEmpty(),
    body('password').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('phone_number').isNumeric().isLength({ min: 10, max: 10 }),
    validate({
      getRedirectUrl: () => '/signup',
    }),
    catchAsync(async (req, res) => {
      const { name, password, email, phone_number } = req.body
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
      const serverUrl = configService.getConfig('SERVER_URL')
      //send email
      if (SEND_EMAIL) {
        await sendEmail({
          to: email,
          subject: 'verify your email',
          text: `verify your email by clicking the link below\n ${serverUrl}/auth/verify_email/${email}/${user.verificationCode}`,
          html: `verify your email by clicking the link below\n ${serverUrl}/auth/verify_email/${email}/${user.verificationCode}`,
        })
      }
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
      //@ts-ignore
      req.session.userId = user.id
      req.flash('successMessages', 'Login success')
      res.redirect('/')
    })
  )

  router.get('/verify_email/:email/:code', async (req, res) => {
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

  router.get('/verify_phone/:phone_number/:otp', async (req, res) => {
    const { phone_number, otp } = req.params
    const user = await User.findOne({ phoneNumber: phone_number })
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
    if (user.otp !== otp) {
      req.flash('errorMessages', 'invalid verification code')
      res.redirect('/login')
      return
    }
    if (user.otp === otp) {
      user.isPhoneVerified = true
      await user.save()
      req.flash('successMessages', 'phone number verified')
      res.redirect('/login')
      return
    }
  })

  router.get('/logout', (req, res) => {
    //@ts-ignore
    req.session.userId = null
    req.flash('successMessages', 'Logout success')
    res.redirect('/login')
  })

  app.use('/auth', router)
}
