const pool = require('../config/database');

class Employee {
  static async create(organizationId, employeeData) {
    const { first_name, last_name, email, phone, position, department, hire_date } = employeeData;

    const query = `
      INSERT INTO employees
      (organization_id, first_name, last_name, email, phone, position, department, hire_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [organizationId, first_name, last_name, email, phone, position, department, hire_date];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(organizationId) {
    const query = `
      SELECT e.*,
             json_agg(
               json_build_object(
                 'team_id', t.id,
                 'team_name', t.name,
                 'assigned_at', et.assigned_at
               )
             ) FILTER (WHERE t.id IS NOT NULL) as teams
      FROM employees e
      LEFT JOIN employee_teams et ON e.id = et.employee_id
      LEFT JOIN teams t ON et.team_id = t.id
      WHERE e.organization_id = $1
      GROUP BY e.id
      ORDER BY e.created_at DESC
    `;

    const result = await pool.query(query, [organizationId]);
    return result.rows;
  }

  static async findById(id, organizationId) {
    const query = `
      SELECT e.*,
             json_agg(
               json_build_object(
                 'team_id', t.id,
                 'team_name', t.name,
                 'assigned_at', et.assigned_at
               )
             ) FILTER (WHERE t.id IS NOT NULL) as teams
      FROM employees e
      LEFT JOIN employee_teams et ON e.id = et.employee_id
      LEFT JOIN teams t ON et.team_id = t.id
      WHERE e.id = $1 AND e.organization_id = $2
      GROUP BY e.id
    `;

    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async update(id, organizationId, employeeData) {
    const { first_name, last_name, email, phone, position, department, hire_date } = employeeData;

    const query = `
      UPDATE employees
      SET first_name = $1, last_name = $2, email = $3, phone = $4,
          position = $5, department = $6, hire_date = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND organization_id = $9
      RETURNING *
    `;

    const values = [first_name, last_name, email, phone, position, department, hire_date, id, organizationId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, organizationId) {
    const query = 'DELETE FROM employees WHERE id = $1 AND organization_id = $2 RETURNING *';
    const result = await pool.query(query, [id, organizationId]);
    return result.rows[0];
  }

  static async getTeams(employeeId, organizationId) {
    const query = `
      SELECT t.*, et.assigned_at
      FROM teams t
      INNER JOIN employee_teams et ON t.id = et.team_id
      INNER JOIN employees e ON et.employee_id = e.id
      WHERE e.id = $1 AND e.organization_id = $2
      ORDER BY et.assigned_at DESC
    `;

    const result = await pool.query(query, [employeeId, organizationId]);
    return result.rows;
  }
}

module.exports = Employee;
