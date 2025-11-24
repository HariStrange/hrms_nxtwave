const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const authMiddleware = require('../middlewares/auth');
const { employeeValidation } = require('../middlewares/validation');

router.use(authMiddleware);

router.post('/', employeeValidation, EmployeeController.createEmployee);
router.get('/', EmployeeController.getAllEmployees);
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', employeeValidation, EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);
router.get('/:id/teams', EmployeeController.getEmployeeTeams);

module.exports = router;
