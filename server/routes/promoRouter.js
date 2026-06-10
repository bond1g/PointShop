const Router = require('express')
const router = new Router()
const promoController = require('../controllers/promoController')
const checkRole = require('../middleware/checkRoleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/apply', promoController.applyPromo)
router.get('/', authMiddleware, checkRole('ADMIN'), promoController.getAll)
router.post('/', authMiddleware, checkRole('ADMIN'), promoController.create)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), promoController.delete)

module.exports = router