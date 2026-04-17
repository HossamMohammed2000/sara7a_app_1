import { model } from "mongoose";
import UserModel from "../../DB/Models/user.model.js";
import { notFoundException } from "../../Utils/Response/error.response.js";
import { successResponse } from "../../Utils/Response/success.response.js";

export  const sendMessage =async(req,res)=> {
    const { recieverId } = req.params;
    const { content } = req.body;
const user =await User.findById({model:UserModel, id:recieverId});
if(!user){
    notFoundException({message:"User not found"})
} 

const message = await MessageModel.create({
    model:MessageModel,
    data:[{content,
    recieverId,
    }],
    
});
return successResponse(res,201,"Message sent successfully",{
    data:{message},
})
}







export const getMessages =async(req,res)=> {
  const message = await MessageModel.find({model:MessageModel});
  return successResponse(res,200,"Messages retrieved successfully",{
      data:{message},
  })
}