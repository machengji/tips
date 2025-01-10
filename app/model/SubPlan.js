// app/model/SubPlan.js
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SubPlanSchema = new Schema({
    explorationPlan: { type: Schema.Types.ObjectId, ref: 'ExplorationPlan', required: true },
    subPlanName: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
  });

  return mongoose.model('SubPlan', SubPlanSchema);
};