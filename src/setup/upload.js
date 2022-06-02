//@ts-check
const multer = require('multer')
const { nanoid } = require('nanoid')
const configService = require('../config/configService')
const path = require('path')

const UPLOADS_DIR = configService.getConfig('UPLOADS_DIR')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR)
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const id = nanoid()
    cb(null, id + ext)
  },
})

const upload = multer({
  storage: storage,
})

module.exports = upload
