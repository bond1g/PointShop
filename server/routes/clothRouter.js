const Router = require('express');
const clothController = require('../controllers/clothController');
const router = new Router()
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', checkRole('ADMIN'), clothController.create)
router.get('/', clothController.getAll)
router.get('/:id', clothController.getOne)
router.patch('/:id', checkRole('ADMIN'), clothController.update)
router.put('/:id/sizes', checkRole('ADMIN'), clothController.updateSizes)
router.delete('/:id', checkRole('ADMIN'), clothController.delete);

module.exports = router