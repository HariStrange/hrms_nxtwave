const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Organization name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const employeeValidation = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim(),
  body('position').optional().trim(),
  body('department').optional().trim(),
  body('hire_date').optional().isISO8601().withMessage('Valid date is required'),
  validate
];

const teamValidation = [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('description').optional().trim(),
  validate
];

const assignmentValidation = [
  body('employee_id').isInt({ min: 1 }).withMessage('Valid employee ID is required'),
  body('team_id').isInt({ min: 1 }).withMessage('Valid team ID is required'),
  validate
];

module.exports = {
  registerValidation,
  loginValidation,
  employeeValidation,
  teamValidation,
  assignmentValidation
};
