const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class Organization {
  static async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO organizations (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `;

    const result = await pool.query(query, [name, email, hashedPassword]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM organizations WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, created_at FROM organizations WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = `
      UPDATE organizations
      SET password = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, name, email
    `;

    const result = await pool.query(query, [hashedPassword, id]);
    return result.rows[0];
  }
}

module.exports = Organization;
