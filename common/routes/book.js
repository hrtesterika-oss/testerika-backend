const express = require('express')
const BookController = require('../controller/book.controller')
const router = express.Router()
const auth = require('../middleware/auth')
const { upload } = require('../middleware/fileUploader')

router.get('/', BookController.findAll)
router.post('/', upload.single('image'), BookController.create)
router.put('/:id', upload.single('image'), BookController.update)
router.get('/:id', BookController.findById)
router.delete('/:id', BookController.delete)

module.exports = router
