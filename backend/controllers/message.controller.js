import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";

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
    const { choices } = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: promt,
        },
      ],
    });

    const reply = {
      ...choices[0].message,
      timestamp: Date.now(),
      isImage: false,
    };
    res.json({
      success: true,
      message: "Message sent",
      reply,
    });

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne(
      {
        _id: userId,
      },
      { $inc: { credits: -1 } }
    );
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


//Image generation message controller

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        //check user credits
        if (req.user.credits <= 2) {
            return res.json({
                success: false,
                message: "You don't have enough credits to generate image. Please purchase more credits.",
            });
        }

        const { chatId, promt, isPublished } = req.body;
        //find chat
        const chat = await Chat.findOne({ userId, _id: chatId });

        //push user message
        chat.messages.push({
            role: "user",
            content: promt,
            timestamp: Date.now(),
            isImage: false,
        });

        


    } catch (error) {
        res.json({
            success: false,
            message: error.message,
        });
    }
}