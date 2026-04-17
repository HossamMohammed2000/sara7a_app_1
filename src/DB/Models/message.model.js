import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minlength: [2, "Message must be at least 2 characters long"],
      maxlength: [1000, "Message must be less than 1000 characters long"],
      trim: true,
    },

    recieverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("message", messageSchema);
