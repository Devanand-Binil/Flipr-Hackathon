import createHttpError from "http-errors";
import validator from "validator";
import {UserModel} from '../models/index.js';
import bcrypt from "bcrypt";

const{DEFAULT_PICTURE,DEFAULT_STATUS}=process.env
export const createUser=async(userData)=>{
  console.log("Creating user with data:", userData);
    const{username,email,picture,status,password}=userData;
    console.log("User data:", username, email, picture, status, password);
    //validate empty fields
    if (!username || !email || !password) {
        throw createHttpError.BadRequest("Please fill all fields.");
      }
    if (!validator.isLength(username,{min:2,max:16,})){
        throw createHttpError.BadRequest("Please make sure name is between 2 to 16 characters long");
    }
    if(status && status.length>64){
        throw createHttpError.BadRequest("Please make sure status is less than 64 characters long");
    }
    if(!validator.isEmail(email)){
      throw createHttpError.BadRequest("Please provide valid email address");
    }
    console.log("Checking if email already exists in the database:", email);
    const checkDb = await UserModel.findOne({email});
    console.log("dbcheck",checkDb);
    if(checkDb){
      throw createHttpError.Conflict("Email already exists");
    }

    if(!validator.isLength(password,{min:6,max:128})){
      throw createHttpError.BadRequest("Please make sure password is between 6 to 128 characters long");
    }

    //hash password---> to be done in the user model



    //adding user to database
    //console.log(name,email,picture,status,password);
   /* const userDoc = await new UserModel({
      name,
      email,
      picture: picture || DEFAULT_PICTURE,
      status: status || DEFAULT_STATUS,
      password
    }).save();
    */
    let userDoc;
    try {
      userDoc = await new UserModel({
        username,
        email,
        picture: picture || DEFAULT_PICTURE,
        status: status || DEFAULT_STATUS,
        password,
      }).save();
    } catch (saveError) {
      console.error("❌ Error while saving user:", saveError);
      throw saveError;
    }

    // Convert to plain object before logging and returning
    const user = userDoc.toObject();
    delete user.password;
    
    console.log("User created:", user);
    
    return user;

};

export const signUser = async(email,password) => {
  const user = await UserModel.findOne({email:email.toLowerCase()}).lean();
  if (!user){
    throw createHttpError.NotFound("Invalid credentials,email not found")
  }
  let passwordMatches = await bcrypt.compare(password, user.password);

  if(!passwordMatches){
    throw createHttpError.NotFound("Invalid credentials, password incorrect")
  }

  return user;
};
