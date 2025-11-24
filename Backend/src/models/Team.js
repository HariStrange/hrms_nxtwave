const pool = require('../config/database');

class Team {
  static async create(organizationId, teamData) {
    const { name, description } = teamData;

    const query = `
      INSERT INTO teams (organization_id, name, description)
      VALUES ($1, $2, $3)
      RETURNING *
    `;

    const result = await pool.query(query, [organizationId, name, description]);
    return result.rows[0];
  }

  static async findAll(organizationId) {
    const query = `
      SELECT t.*,
             COUNT(et.employee_id)::int as member_count,
             json_agg(
               json_build_object(
                 'employee_id', e.id,
                 'first_name', e.first_name,
                 'last_name', e.last_name,
                 'email', e.email,
                 'position', e.position,
                 'assigned_at', et.assigned_at
               )
             ) FILTER (WHERE e.id IS NOT NULL) as members
      FROM teams t
      LEFT JOIN employee_teams et ON t.id = et.team_id
      LEFT JOIN employees e ON et.employee_id = e.id
      WHERE t.organization_id = $1
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [organizationId]);
    return result.rows;
  }

  static async findById(id, organizationId) {
    const query = `
      SELECT t.*,
             COUNT(et.employee_id)::int as member_count,
             json_agg(
               json_build_object(
                 'employee_id', e.id,
                 'first_name', e.first_name,
                 'last_name', e.last_name,
                 'email', e.email,
                 'position', e.position,
                 'assigned_at', et.assigned_at
               )
             ) FILTER (WHERE e.id IS NOT NULL) as members
      FROM teams t
      LEFT JOIN employee_teams et ON t.id = et.team_id
      LEFT JOIN employees e ON et.employee_id = e.id
      WHERE t.id = $1 AND t.organization_id = $2
      GROUP BY t.id
    `;

    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async update(id, organizationId, teamData) {
    const { name, description } = teamData;

    const query = `
      UPDATE teams
      SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND organization_id = $4
      RETURNING *
    `;

    const result = await pool.query(query, [name, description, id, organizationId]);
    return result.rows[0];
  }

  static async delete(id, organizationId) {
    const query = 'DELETE FROM teams WHERE id = $1 AND organization_id = $2 RETURNING *';
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async assignEmployee(employeeId, teamId, organizationId) {
    // Verify both employee and team belong to the organization
    const verifyQuery = `
      SELECT
        (SELECT COUNT(*) FROM employees WHERE id = $1 AND organization_id = $3) as emp_exists,
        (SELECT COUNT(*) FROM teams WHERE id = $2 AND organization_id = $3) as team_exists
    `;

    const verification = await pool.query(verifyQuery, [employeeId, teamId, organizationId]);

    if (verification.rows[0].emp_exists === '0' || verification.rows[0].team_exists === '0') {
      throw new Error('Employee or Team not found in this organization');
    }

    const query = `
      INSERT INTO employee_teams (employee_id, team_id)
      VALUES ($1, $2)
      ON CONFLICT (employee_id, team_id) DO NOTHING
      RETURNING *
    `;

    const result = await pool.query(query, [employeeId, teamId]);
    return result.rows[0];
  }

  static async unassignEmployee(employeeId, teamId) {
    const query = `
      DELETE FROM employee_teams
      WHERE employee_id = $1 AND team_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [employeeId, teamId]);
    return result.rows[0];
  }

  static async getMembers(teamId, organizationId) {
    const query = `
      SELECT e.*, et.assigned_at
      FROM employees e
      INNER JOIN employee_teams et ON e.id = et.employee_id
      INNER JOIN teams t ON et.team_id = t.id
      WHERE t.id = $1 AND t.organization_id = $2
      ORDER BY et.assigned_at DESC
    `;

    const result = await pool.query(query, [teamId, organizationId]);
    return result.rows;
  }
}

module.exports = Team;
