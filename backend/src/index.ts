import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   */
  register({ strapi }: { strapi: Core.Strapi }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * Sets up default Public role permissions for Professional.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const publicRole = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({
        where: { type: 'public' },
      });

    if (!publicRole) {
      strapi.log.warn('Public role not found — skipping permission setup');
      return;
    }

    const actions = [
      'api::professional.professional.find',
      'api::professional.professional.findOne',
    ];

    const existingPermissions = await strapi.db
      .query('plugin::users-permissions.permission')
      .findMany({
        where: { role: publicRole.id },
      });

    const existingActions = new Set(
      existingPermissions.map((p: { action: string }) => p.action)
    );

    for (const action of actions) {
      if (!existingActions.has(action)) {
        await strapi.db.query('plugin::users-permissions.permission').create({
          data: {
            action,
            role: publicRole.id,
          },
        });
        strapi.log.info(`Permission granted: ${action} → Public role`);
      }
    }
  },
};
