const jwt = require('jsonwebtoken');
const Organization = require('../models/Organization');
const Logger = require('../utils/logger');

class AuthController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const existingOrg = await Organization.findByEmail(email);
      if (existingOrg) {
        return res.status(409).json({
          success: false,
          message: 'Organization with this email already exists'
        });
      }

      const organization = await Organization.create(name, email, password);

      await Logger.log(
        organization.id,
        organization.id,
        `Organization '${name}' registered`,
        'organization',
        organization.id,
        JSON.stringify({ email }),
        req.ip
      );

      const token = jwt.sign(
        { id: organization.id, email: organization.email, organizationId: organization.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      res.status(201).json({
        success: true,
        message: 'Organization registered successfully',
        data: {
          organization,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const organization = await Organization.findByEmail(email);
      if (!organization) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      const isPasswordValid = await Organization.verifyPassword(password, organization.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      await Logger.log(
        organization.id,
        organization.id,
        `User '${organization.id}' logged in`,
        'organization',
        organization.id,
        null,
        req.ip
      );

      const token = jwt.sign(
        { id: organization.id, email: organization.email, organizationId: organization.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      delete organization.password;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          organization,
          token
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      await Logger.log(
        req.user.organizationId,
        req.user.id,
        `User '${req.user.id}' logged out`,
        'organization',
        req.user.id,
        null,
        req.ip
      );

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req, res, next) {
    try {
      const organization = await Organization.findById(req.user.id);

      if (!organization) {
        return res.status(404).json({
          success: false,
          message: 'Organization not found'
        });
      }

      res.status(200).json({
        success: true,
        data: organization
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
