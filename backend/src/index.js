'use strict';

/**
 * Strapi bootstrap file.
 *
 * - Creates a default admin user (example) on first run.
 * - Ensures a default shipping method "Correios PAC" exists (admin can edit later).
 *
 * IMPORTANT: Change default credentials in production.
 */

module.exports = {
  async bootstrap({ strapi }) {
    // Create default admin user if not exists
    try {
      const email = 'admin@example.com';
      const password = 'ChangeMe123!'; // CHANGE BEFORE PRODUCTION

      const adminExists = await strapi.query('admin::user').findOne({ where: { email } });

      if (!adminExists) {
        // The strapi.admin services are available to create an admin user
        await strapi.admin.services.user.create({
          email,
          firstname: 'Admin',
          lastname: 'Admin',
          password,
          isActive: true,
        });

        strapi.log.info(`Default admin user created: ${email}`);
      }
    } catch (err) {
      strapi.log.error('Error creating admin user', err);
    }

    // Ensure Correios shipping method exists
    try {
      const existing = await strapi.entityService.findMany('api::shipping-method.shipping-method', {
        filters: { name: 'Correios PAC' },
        limit: 1,
      });

      if (existing.length === 0) {
        await strapi.entityService.create('api::shipping-method.shipping-method', {
          data: {
            name: 'Correios PAC',
            type: 'correios',
            estimatedDays: 8,
            active: true,
          },
        });
        strapi.log.info('Default shipping method "Correios PAC" created.');
      }
    } catch (err) {
      strapi.log.error('Error ensuring default shipping method', err);
    }
  },
};
