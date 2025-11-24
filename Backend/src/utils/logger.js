const pool = require('../config/database');

class Logger {
  static async log(organizationId, userId, action, entityType = null, entityId = null, details = null, ipAddress = null) {
    try {
      const query = `
        INSERT INTO audit_logs
        (organization_id, user_id, action, entity_type, entity_id, details, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;

      const values = [organizationId, userId, action, entityType, entityId, details, ipAddress];
      const result = await pool.query(query, values);

      // Console log for development
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ${action} - Organization: ${organizationId}, User: ${userId}`);

      return result.rows[0];
    } catch (error) {
      console.error('Error writing to audit log:', error);
      throw error;
    }
  }

  static async getUserLogs(organizationId, limit = 100, offset = 0) {
    try {
      const query = `
        SELECT * FROM audit_logs
        WHERE organization_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;

      const result = await pool.query(query, [organizationId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  }

  static async getLogsByEntity(organizationId, entityType, entityId) {
    try {
      const query = `
        SELECT * FROM audit_logs
        WHERE organization_id = $1 AND entity_type = $2 AND entity_id = $3
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query, [organizationId, entityType, entityId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching entity logs:', error);
      throw error;
    }
  }
}

module.exports = Logger;
