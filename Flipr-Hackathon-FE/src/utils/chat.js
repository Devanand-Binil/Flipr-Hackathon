export const getConversationId=(user,users)=>{
    return users[0]._id===user._id ? users[1]._id : users[0]._id;
}
/*
export const getConversationName=(user,users)=>{
    return users[0]._id===user._id ? users[1].name : users[0].name;
}
    */

export const getConversationName = (user, users) => {
    if (!users || users.length < 2) return "Unknown";
  
    const userId = user._id.toString();
  
    // Find the other user who is not the current user
    const otherUser = users.find(u => u._id.toString() !== userId);
  
    // Return their username or fallback to "Unknown"
    return otherUser ? otherUser.username || "Unknown" : "Unknown";
  };
  

export const getConversationPicture=(user,users)=>{
    return users[0]._id===user._id ? users[1].picture : users[0].picture;
}

export const checkOnlineStatus = (onlineUsers, user, users) => {
    let convoId = getConversationId(user, users);
    let check = onlineUsers.find((u) => u.userId === convoId);
    return check ? true : false;
  };