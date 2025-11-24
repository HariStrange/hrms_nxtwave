const Employee = require('../models/Employee');
const Logger = require('../utils/logger');

class EmployeeController {
  static async createEmployee(req, res, next) {
    try {
      const employee = await Employee.create(req.user.organizationId, req.body);

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' added a new employee with ID ${employee.id}`,
        'employee',
        employee.id,
        JSON.stringify({ name: `${employee.first_name} ${employee.last_name}`, email: employee.email }),
        req.ip
      );

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllEmployees(req, res, next) {
    try {
      const employees = await Employee.findAll(req.user.organizationId);

      res.status(200).json({
        success: true,
        count: employees.length,
        data: employees
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeById(req, res, next) {
    try {
      const employee = await Employee.findById(req.params.id, req.user.organizationId);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateEmployee(req, res, next) {
    try {
      const employee = await Employee.update(req.params.id, req.user.organizationId, req.body);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' updated employee ${employee.id}`,
        'employee',
        employee.id,
        JSON.stringify(req.body),
        req.ip
      );

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteEmployee(req, res, next) {
    try {
      const employee = await Employee.delete(req.params.id, req.user.organizationId);

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found'
        });
      }

      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' deleted employee ${employee.id}`,
        'employee',
        employee.id,
        JSON.stringify({ name: `${employee.first_name} ${employee.last_name}` }),
        req.ip
      );

      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
        data: employee
      });
    } catch (error) {
      next(error);
    }
  }

  static async getEmployeeTeams(req, res, next) {
    try {
      const teams = await Employee.getTeams(req.params.id, req.user.organizationId);

      res.status(200).json({
        success: true,
        count: teams.length,
        data: teams
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = EmployeeController;
