import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { createConversation, doesConversationExist, getUserConversations, populateConversation } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";
import { populate } from "dotenv";
import dotenv from 'dotenv';
dotenv.config();


export const create_open_conversation = async(req,res,next)=>{
    try{
        const sender_id = req.user.userId;
        const {receiver_id, isGroup} = req.body;
        console.log("Creating or opening conversation for user:", sender_id);
        console.log("Receiver ID:", receiver_id);
        console.log("Is Group Conversation:", isGroup);

        if (!isGroup){
          if (!receiver_id){
            console.error("Receiver ID is required for non-group conversations");
            logger.error("Need user id to start conversation");
            throw next(createHttpError.BadGateway('Something went wrong!'));
          }
          const existed_conversation = await doesConversationExist(sender_id,receiver_id,false);
          console.log("Existed conversation:", existed_conversation);
          if (existed_conversation){
              res.json(existed_conversation);
          }
          else{
              let receiver_user= await findUser(receiver_id);
              //console.log("Receiver user found:", receiver_user.toObject().username);
              let convoData = {
                  name: receiver_user.username,
                  picture: receiver_user.profilePicture,
                  isGroup:false,
                  users:[sender_id,receiver_id],
              }
              console.log("Creating new conversation with data:", convoData);
              const newConvo = await createConversation(convoData);
              console.log("New conversation created:", newConvo);
              const populatedConvo = await populateConversation(newConvo._id,"users","-password")
              res.status(200).json(populatedConvo);
          }
        }
        else{

          const existed_group_conversation = await doesConversationExist("","", isGroup);

          res.status(200).json(existed_group_conversation);
        }


    }catch(error){
        next(error)
    }
}

export const getConversations = async(req,res,next)=>{
    try{
        console.log("Fetching user conversations");
        const user_id = req.user.userId;
        console.log("User ID:", user_id);
        const conversations = await getUserConversations(user_id);
        console.log("Conversations fetched:", conversations);
        res.status(200).json(conversations);
    }
    catch(error){
        next(error);
    }
}

export const createGroup = async(req,res,next)=>{
    const { name, users } = req.body;
    //add current user to users
    users.push(req.user.userId);
    if (!name || !users) {
      throw createHttpError.BadRequest("Please fill all fields.");
    }
    if (users.length < 2) {
      throw createHttpError.BadRequest(
        "Atleast 2 users are required to start a group chat."
      );
    }
    let convoData = {
      name,
      users,
      isGroup: true,
      admin: req.user.userId,
      picture: process.env.DEFAULT_GROUP_PICTURE,
    };
    try {
      console.log("Creating group conversation with data:", convoData);
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users admin",
        "-password"
      );
      console.log(populatedConvo)
      res.status(200).json(populatedConvo);
    } catch (error) {
      next(error);
    }
  };
