/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // router.get('/', controller.home.index);
  
  // ExplorationPlan routes
  router.post('/api/exploration-plans', controller.explorationPlan.create);
  router.get('/api/exploration-plans/:id', controller.explorationPlan.show);
  router.put('/api/exploration-plans/:id', controller.explorationPlan.update);
  router.delete('/api/exploration-plans/:id', controller.explorationPlan.destroy);
  router.get('/api/exploration-plans', controller.explorationPlan.index);
  
  // SubPlan routes
  router.post('/api/sub-plans', controller.subPlan.create);
  router.get('/api/sub-plans/:id', controller.subPlan.show);
  router.put('/api/sub-plans/:id', controller.subPlan.update);
  router.delete('/api/sub-plans/:id', controller.subPlan.destroy);
  router.get('/api/sub-plans', controller.subPlan.index);

  router.post('/api/ask', controller.ai.ask);
  router.post('/api/user/wechat-login', controller.user.wechatLogin);
  router.post('/api/uploadBehaviors', controller.behaviors.upload);
  router.post('/api/sendmessage', controller.home.sendMessage);
  // router.post('/api/gpt4o/completion', controller.gpt4o.getCompletion);
  router.get('/api/plans/:email', controller.plan.getPlans);
  router.post('/api/plans/:email', controller.plan.savePlans);
  router.get('/api/behaviors', controller.behaviors.getByEmail);
  router.post('/api/anchors', controller.behaviors.saveAnchorList);
  router.get('/api/anchors', controller.behaviors.getAnchorList);
  router.get('/api/behaviors/:email/:anchorName', controller.behaviors.getBehaviorList);
  router.get('/download/apk', controller.download.apk);
};
