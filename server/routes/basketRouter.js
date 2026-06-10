const Router = require('express')
const router = new Router()
const cartController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware')
const basketController = require('../controllers/basketController')

router.get('/', authMiddleware, basketController.getBasket)
router.post('/items', authMiddleware, basketController.addItem)
router.put('/items/:id', authMiddleware, basketController.updateQuantity)
router.delete('/items/:id', authMiddleware, basketController.deleteItem)
router.delete('/clear', authMiddleware, basketController.clearBasket)

module.exports = router