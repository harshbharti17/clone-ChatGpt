import Chat from "../models/chat.model.js";

//Text-based AI chat message controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { chatId, promt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: promt,
      timestamp: Date.now(),
      isImage: false,
    });
  } catch (error) {
    
  }
};
