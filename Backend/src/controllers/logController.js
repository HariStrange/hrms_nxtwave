const Logger = require('../utils/logger');

class LogController {
  static async getLogs(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const offset = parseInt(req.query.offset) || 0;

      const logs = await Logger.getUserLogs(req.user.organizationId, limit, offset);

      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLogsByEntity(req, res, next) {
    try {
      const { entity_type, entity_id } = req.params;

      const logs = await Logger.getLogsByEntity(
        req.user.organizationId,
        entity_type,
        entity_id
      );

      res.status(200).json({
        success: true,
        count: logs.length,
        data: logs
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LogController;
