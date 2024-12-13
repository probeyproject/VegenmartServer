import db from "../db/db.js";
import messageModel from "../models/message.model.js"
import { addNotificationModel } from "../models/notification.model.js";
import { getOnlineUserSocketIdModel, insertOrUpdatePresenceModel, updateUserPresenceModel } from "../models/userPresence.model.js";




const socketHandler = (io) => {

    io.on("connection", (socket) => {
      console.log("Client connected", socket.id);
      socket.on("authenticate", async (userId) => {
        try {
            await insertOrUpdatePresenceModel(userId, socket.id);

          socket.userId = userId;
        } catch (error) {
          console.error("Error updating user presence:", error);
        }
      });

      socket.on("typing", (receiverId) => {
        io.to(receiverId).emit("typing", { senderId: socket.userId });
      });

      socket.on("newMessage", async (data) => {
        try {
          const { senderId, receiverId, message } = data;
          const conversation = await messageModel.getMessages(senderId, receiverId);
          let conversationId = conversation?.conversationId; // Extract the conversation ID if it exists
          if (!conversationId) {
            // Insert a new conversation and get the ID (MySQL2 returns [rows, fields], and insertId holds the inserted row's ID)
            const [newConversation] = await db.query(
              `INSERT INTO conversations (sender_id, receiver_id) 
               VALUES (?, ?)`,
              [senderId, receiverId]
            );
            conversationId = newConversation.insertId; 
            console.log(conversationId,"dhfiuhsduifh")
          }
      
          const messageData = await messageModel.createMessage(conversationId, senderId, message);
      
          const onlineResult = await getOnlineUserSocketIdModel(receiverId);  
          if (onlineResult.length > 0) {
            const socketId = onlineResult[0].socket_id;
            io.to(socketId).emit("newMessage", messageData);
            io.to(socket.id).emit("messageDelivered", { messageId: messageData.id });
          } else {
            const user=await getUserByIdModel(senderId)
            const senderName=`${user[0].first_name} ${user[0].last_name}`;
            const result=await addNotificationModel(receiverId, `${senderName}, sent you a message: ${message}`, 'alert');
          }
        } catch (error) {
          console.error("Error handling new message:", error);
        }
      });
      
      socket.on("getMessages", async (data) => {
        try {
          const { senderId, receiverId } = data;
          const messages = await messageModel.getMessages(senderId, receiverId);
          io.to(socket.id).emit("messages", messages);
        } catch (error) {
          console.error("Error handling get messages:", error);
        }
      });

      socket.on("messageSeen", async (data) => {
        try {
          const { messageId } = data;
          await messageModel.updateMessageSeen(messageId);

          const senderIdResult = await db.query(
            "SELECT sender_id FROM messages WHERE id = ?",
            [messageId]
          );
    
          if (senderIdResult.length > 0) {
            const senderId = senderIdResult[0].sender_id;
    
            const senderSocketResult = await getOnlineUserSocketIdModel(senderId);
    
            if (senderSocketResult.length > 0) {
              const senderSocketId = senderSocketResult[0].socket_id;
              io.to(senderSocketId).emit("messageSeen", { messageId });
            }
          }
        } catch (error) {
          console.error("Error handling message seen:", error);
        }
      });
    
      socket.on("disconnect", async () => {
        console.log("Client disconnected", socket.id);
    
        try {
          await updateUserPresenceModel(socket.id);
        } catch (error) {
          console.error("Error setting user offline:", error);
        }
      });
    });
    
};

export default socketHandler;
