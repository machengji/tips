// app/model/ExplorationPlan.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ExplorationPlanSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planName: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    isFirstExploration: { type: Boolean, default: true },
    isPinned: { type: Boolean, default: false },
    subPlans: [{ type: Schema.Types.ObjectId, ref: 'SubPlan' }]
  });

  return mongoose.model('ExplorationPlan', ExplorationPlanSchema);
};