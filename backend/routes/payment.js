const express = require('express')
const router = express.Router()

const {processPayment,sendStripeApi} = require('../controllers/paymentController')

router.post('/payment/process',processPayment)
router.get('/stripeapi',sendStripeApi)

module.exports = router;