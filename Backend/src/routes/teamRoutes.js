const express = require('express');
const router = express.Router();
const TeamController = require('../controllers/teamController');
const authMiddleware = require('../middlewares/auth');
const { teamValidation, assignmentValidation } = require('../middlewares/validation');

router.use(authMiddleware);

router.post('/', teamValidation, TeamController.createTeam);
router.get('/', TeamController.getAllTeams);
router.get('/:id', TeamController.getTeamById);
router.put('/:id', teamValidation, TeamController.updateTeam);
router.delete('/:id', TeamController.deleteTeam);
router.get('/:id/members', TeamController.getTeamMembers);
router.post('/assign', assignmentValidation, TeamController.assignEmployee);
router.post('/unassign', assignmentValidation, TeamController.unassignEmployee);

module.exports = router;
