import createHttpError from "http-errors";
import { UserModel } from "../models/index.js"
export const findUser=async(userId)=>{
    const user=await UserModel.findById(userId).lean();
    if(!user) throw createHttpError.BadRequest('Please enter all the user details correctly')
    return user;
}

export const searchUsers=async(keyword, userId)=>{
    const users=await UserModel.find({
        $or:[
            {name:{$regex: keyword, $options:"i"}},
            {email:{$regex: keyword, $options:"i"}},
        ]

    }).find({
        _id:{$ne:userId},
    });
    return users;
}
