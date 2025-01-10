module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AnchorBehaviorSchema = new Schema({
    anchorName: { type: String, required: true },
    time: { type: Date, required: true },
    subPlans: [{
      type: Schema.Types.ObjectId,
      ref: 'SubPlan',
      required: true
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongoose.model('AnchorBehavior', AnchorBehaviorSchema);
};