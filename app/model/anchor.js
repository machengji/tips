module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AnchorSchema = new Schema({
    email: { type: String, required: true },
    anchorList: [{
      name: { type: String, required: true },
      hour: { type: Number, default: null },
      minute: { type: Number, default: null }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

  return mongoose.model('Anchor', AnchorSchema);
}; 