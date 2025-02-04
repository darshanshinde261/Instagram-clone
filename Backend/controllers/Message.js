const conversation = require("../models/conversationModel");
const message = require("../models/messageModel");
const { getReceiverSocketId } = require("../Socket/socket");

const { io } = require("../Socket/socket");

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage } = req.body;
    let Conversation = await conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!Conversation) {
      Conversation = await conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await message.create({
      senderId,
      receiverId,
      textMessage,
    });

    if (newMessage) {
      Conversation.messages.push(newMessage._id);

      await Promise.all([Conversation.save(), newMessage.save()]);
    }

    // implement socket io for real time transfer

    const receiverSocketId = getReceiverSocketId(receiverId);
    const notification = {
      type: "message",
      userId: senderId,
      message: "you have new message",
    };
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      io.to(receiverSocketId).emit("arrive", notification);
    }

    return res.status(200).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "failed to send message",
      error,
    });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const Conversation = await conversation
      .findOne({
        participants: { $all: [senderId, receiverId] },
      })
      .populate({
        path: "messages",
      });

    if (!Conversation) {
      return res.status(200).json({ success: true, message: "no messages" });
    }
    return res.status(200).json({
      success: true,
      messages: Conversation?.messages,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "failed to get messages",
    });
  }
};

exports.deleteMessages = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const Conversation = await conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      await message.deleteMany({ _id: { $in: Conversation.messages } });
      Conversation.messages = [];
      await Conversation.save();
    return res.status(200).json({
        success:true,
        message:"conversation delete",
    })

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "failed delete messages",
    });
  }
};
