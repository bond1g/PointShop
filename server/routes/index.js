const Router = require('express')
const router = new Router()
const clothRouter = require('./clothRouter')
const userRouter = require('./userRouter')
const typeRouter = require('./typeRouter')
const brandRouter = require('./brandRouter')
const basketRouter = require('./basketRouter')
const promoRouter = require('./promoRouter')
const orderRouter = require('./orderRouter');
const paymentRouter = require('./paymentRouter');

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/cloth', clothRouter)
router.use('/basket', basketRouter)
router.use('/promo', promoRouter)
router.use('/order', orderRouter);
router.use('/payment', paymentRouter)

module.exports = router