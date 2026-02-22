import mongoose from "mongoose";
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from "../../Utils/enums/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, minlength: 2, maxlength: 25 },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.System;
      },
    },
    DOB: Date,
    phone: { type: String },
    gender: {
      type: Number,
      enum: Object.values(GenderEnum),
      default: GenderEnum.Male,
    },
    role: {
      type: Number,
      enum: Object.values(RoleEnum),
      default: RoleEnum.User,
    },
    provider: {
      type: Number,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.System,
    },
    confirmEmail: Date,
    profilePic: { type: String },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .set(function (name) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({
      firstName,
      lastName,
    });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

const UserModel = mongoose.model("user", userSchema);
export default UserModel;
