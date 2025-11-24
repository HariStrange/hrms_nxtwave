const Team = require("../models/Team");
const Logger = require("../utils/logger");

class TeamController {
  static async createTeam(req, res, next) {
    try {
      const team = await Team.create(req.user.organizationId, req.body);

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' added a new team with ID ${team.id}`,
        "team",
        team.id,
        JSON.stringify({ name: team.name }),
        req.ip
      );

      res.status(201).json({
        success: true,
        message: "Team created successfully",
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllTeams(req, res, next) {
    try {
      const teams = await Team.findAll(req.user.organizationId);

      res.status(200).json({
        success: true,
        count: teams.length,
        data: teams,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTeamById(req, res, next) {
    try {
      const team = await Team.findById(req.params.id, req.user.organizationId);

      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }

      res.status(200).json({
        success: true,
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTeam(req, res, next) {
    try {
      const team = await Team.update(
        req.params.id,
        req.user.organizationId,
        req.body
      );

      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' updated team ${team.id}`,
        "team",
        team.id,
        JSON.stringify(req.body),
        req.ip
      );

      res.status(200).json({
        success: true,
        message: "Team updated successfully",
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTeam(req, res, next) {
    try {
      const team = await Team.delete(req.params.id, req.user.organizationId);

      if (!team) {
        return res.status(404).json({
          success: false,
          message: "Team not found",
        });
      }

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' deleted team ${team.id}`,
        "team",
        team.id,
        JSON.stringify({ name: team.name }),
        req.ip
      );

      res.status(200).json({
        success: true,
        message: "Team deleted successfully",
        data: team,
      });
    } catch (error) {
      next(error);
    }
  }

  static async assignEmployee(req, res, next) {
    try {
      const { employee_id, team_id } = req.body;

      const assignment = await Team.assignEmployee(
        employee_id,
        team_id,
        req.user.organizationId
      );

      if (!assignment) {
        return res.status(409).json({
          success: false,
          message: "Employee is already assigned to this team",
        });
      }

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' assigned employee ${employee_id} to team ${team_id}`,
        "employee_team",
        assignment.id,
        JSON.stringify({ employee_id, team_id }),
        req.ip
      );

      res.status(201).json({
        success: true,
        message: "Employee assigned to team successfully",
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async unassignEmployee(req, res, next) {
    try {
      const { employee_id, team_id } = req.body;

      const result = await Team.unassignEmployee(employee_id, team_id);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: "Assignment not found",
        });
      }

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' unassigned employee ${employee_id} from team ${team_id}`,
        "employee_team",
        null,
        JSON.stringify({ employee_id, team_id }),
        req.ip
      );

      res.status(200).json({
        success: true,
        message: "Employee unassigned from team successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTeamMembers(req, res, next) {
    try {
      const members = await Team.getMembers(
        req.params.id,
        req.user.organizationId
      );

      res.status(200).json({
        success: true,
        count: members.length,
        data: members,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TeamController;
