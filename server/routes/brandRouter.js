const Router = require('express');
const brandController = require('../controllers/brandController');
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', checkRole('ADMIN'), brandController.create)
router.get('/', brandController.getAll)
router.delete('/:id', checkRole('ADMIN'), brandController.delete);

module.exports = router