import createHttpError from "http-errors";
import { UserModel, ConversationModel } from "../models/index.js";

export const doesConversationExist=async(sender_id,receiver_id, isGroup)=>{

   if(isGroup === false){
    let convos = await ConversationModel.find({
        isGroup:false,
        $and:[
            {users: {$elemMatch:{$eq: sender_id}}},
            {users: {$elemMatch:{$eq: receiver_id}}},

        ]
    }).populate("users","-password").populate('latestMessage')

    if(!convos) throw createHttpError.BadRequest('Something went wrong !');

    convos = await UserModel.populate(convos,{
        path:"latestMessage.sender",
        select:"name email picture status",
    });

    return convos[0];
   }
   else{
    let convo = await ConversationModel.findById(
        isGroup
    ).populate("users admin","-password").populate('latestMessage')

    if(!convo) throw createHttpError.BadRequest('Something went wrong !');

    convo = await UserModel.populate(convo,{
        path:"latestMessage.sender",
        select:"name email picture status",
    });

    return convo;
   }
};

export const createConversation = async(data)=>{
    const newConvo = await ConversationModel.create(data);
    if(!newConvo) throw createHttpError.BadRequest('Something went wrong!');
    return newConvo;
}

export const populateConversation = async(id, fieldToPopulate,fieldsToRemove)=>{
    const populatedConvo = await ConversationModel.findOne({_id:id}).populate(fieldToPopulate,fieldsToRemove);
    if(!populatedConvo) throw createHttpError.BadRequest('Something went wrong !');
    return populatedConvo;

}

export const getUserConversations = async(user_id)=>{
    let conversations;
    await ConversationModel.find({
        users:{$elemMatch:{$eq:user_id}}
    }).populate('users','-password').populate('admin','-password').populate('latestMessage').sort({updatedAt:-1})
    .then(async (results)=>{
        results = await UserModel.populate(results,{
            path:"latestMessage.sender",
            select:"name email picture status"
        });
        conversations=results ;
    }).catch((err)=>{
        throw createHttpError.BadRequest("Something went wrong !");
    });
    return conversations;
};
