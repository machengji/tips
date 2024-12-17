/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/ask', controller.ai.ask);
  router.post('/api/uploadBehaviors', controller.behaviors.upload);
};
