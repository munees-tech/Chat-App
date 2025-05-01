import User from "../models/user.model.js";
import clodinary from "../lib/clodinary.js"
import Message from "../models/message.model.js"
import { getReciverSocketId, io } from "../lib/socket.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedinUser = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: loggedinUser } }).select("-password");
    res.status(200).json(filteredUser);
  } catch (error) {
    console.log(`Error in getAllUsers ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId,  reciverId: userToChatId },
        { senderId: userToChatId,  reciverId: myId },
      ],
    })

    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error in getMessage controller: ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const {text,image} = req.body;
    const {id: reciverId} = req.params;
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
      const uploadResponce = await clodinary.uploader.upload(image);
      imageUrl = uploadResponce.secure_url;
    }
    const newMessage = new Message({
      senderId,
      text,
      reciverId,
      image: imageUrl
    })
    await newMessage.save()
    // implement socket io for real time conversation
    const reciverSocketId = getReciverSocketId(reciverId);
    if(reciverId){
      io.to(reciverSocketId).emit("newMessage",newMessage)
    }
    res.status(201).json(newMessage)

  } catch (error) {
    console.log(`Erroe in sendMessage controller ${error}`);
    res.status(500).json({ message: "Internal server error" });
  }
}