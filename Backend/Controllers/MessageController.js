import { Message } from "../Models/MessageModel.js";
import { Chat } from "../Models/ChatModel.js";

export const createChatAndFirstMessage = async (req, res) => {
  const { userId1, userId2, messageText, senderId } = req.body; // Receive user IDs and the first message
  console.log(userId1, userId2, messageText, senderId);
  try {
    // Step 2: Generate the unique chat ID for 1-on-1 chat
    const chatId = [userId1, userId2].sort().join("_"); // Lexicographically sorted

    // Step 3: Check if chat already exists
    let chat = await Chat.findOne({ chatId });

    if (!chat) {
      // Step 4: If chat doesn't exist, create a new chat document
      chat = new Chat({
        chatId,
        participants: [userId1, userId2], // Add users to participants list
      });
      await chat.save();
    }

    // Step 5: Create the first message
    const newMessage = new Message({
      chatId,
      sender: senderId, // The user who sent the first message
      text: messageText,
    });
    await newMessage.save();

    // Step 6: Respond to client with created chat and message
    res.status(201).json({ chatId, message: newMessage });
  } catch (error) {
    res.status(500).json({
      error: "Error creating chat or message",
      details: error.message,
    });
  }
};
export const retrieveMessages = async (req, res) => {
  const { chatId } = req.params; // Get the chatId from the URL parameters

  try {
    // Step 1: Find all messages associated with the given chatId
    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 }) // Sort by creation time in ascending order
      .exec();

    if (!messages) {
      return res
        .status(404)
        .json({ error: "No messages found for this chat." });
    }

    // Step 2: Return the messages
    res.status(200).json({ chatId, messages });
  } catch (error) {
    // Step 3: Handle errors
    res.status(500).json({
      error: "Error retrieving messages",
      details: error.message,
    });
  }
};
