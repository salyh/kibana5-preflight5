import mainRoute from './server/routes/main';

export default function (kibana) {
  return new kibana.Plugin({
    require: ['elasticsearch'],

    uiExports: {

      app: {
        title: 'Preflight Check',
        description: 'Health check for elasticsearch',
        main: 'plugins/preflight_5/app',
        icon: 'plugins/preflight_5/cc.png',
      },


      hacks: [
        'plugins/preflight_5/hack'
      ]

    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },


    init(server, options) {
      mainRoute(server);
    }


  });
};
