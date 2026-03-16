import Joi from "joi";
import mongoose, { Schema } from "mongoose";


const tokenSchema = new mongoose.Schema({
    jti:{
        type: String,
        required: true,
        unique: true,
    },
     userId: {
        type: Schema.Types.ObjectId,
        required: true, 
        ref: "user",
    },
    expiresIn:{
        type: Date,
        required: true,

    }
},
{
    timestamps: true,
}
);
// ttl => time to live
tokenSchema.index({ expiresIn: 1 }, { expireAfterSeconds: 0 });
tokenSchema.methods.toJSON = function () {
    const token = this.toObject();
    delete token.__v;
    return token;
}

 
const TokenModel = mongoose.model("token", tokenSchema);
export default TokenModel;
