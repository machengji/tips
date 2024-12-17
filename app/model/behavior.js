'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const BehaviorSchema = new Schema({
    email: { type: String, required: true },
    behaviors: {
      type: [
        {
          anchorName: { type: String, required: true },
          time: { type: String, default: '' }, // 新增锚点时间字段
          behaviorList: {
            type: [
              {
                id: { type: Number, required: true },
                name: { type: String, required: true },
                translateY: { type: Number, default: 0 },
                isDragging: { type: Boolean, default: false },
              },
            ],
            default: [],
          },
        },
      ],
      default: [],
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  return mongoose.model('Behavior', BehaviorSchema);
};
