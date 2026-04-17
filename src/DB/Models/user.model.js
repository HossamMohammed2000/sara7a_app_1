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

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // 🔥 مهم عشان مشكلة login
      trim: true,
    },

    password: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.System;
      },
    },

    DOB: Date,
    age: Number,

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

    confirmEmailOtp: String,
    confirmEmail: Date,

    // ================= OTP SYSTEM =================
    otpExpiresAt: Date,

    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpResendAt: Date,

   
    forgotPasswordOtp: { type: String },
    forgotPasswordOtpExpiry: { type: Date },

    profilePic: { type: String },

    coverImages: [{ type: String }],

    isActive: Boolean,

    changeCredentialsTime: Date,
freezedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
freezedAt: Date,
restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
restoredAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    capped:{ size: 1000000},
  },
);

// ================= VIRTUAL =================
userSchema
  .virtual("userName")
  .set(function (value) {
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
