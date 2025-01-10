// app/model/Plan.js
module.exports = app => {
    const mongoose = app.mongoose;
    const Schema = mongoose.Schema;
  
    const PlanSchema = new Schema({
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      plans: { type: Array, default: [] },
    });
  
    return mongoose.model('Plan', PlanSchema);
  };
  