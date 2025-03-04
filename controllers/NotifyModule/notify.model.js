import db from "../../db/db.js";



 export const notifymodel = async (req,res)=>{
    const { userId, product_id, message } = req.body;

  if (!userId || !product_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await db.query(
      "INSERT INTO notifier (userId, product_id, message, created_at) VALUES (?, ?, ?, NOW())",
      [userId, product_id, message]
    );
    res.status(201).json({ message: "Notification request saved" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

 export const getallnotify = async (req,res)=>{
    try {
        const [notifications] =  await db.query("SELECT * FROM notifier");
        res.status(200).json(notifications);
        // console.log(notifications);
        
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch notifications" });
      }
}

export const deleteNotifybytId = async (req, res) => {
    try {
      const { notify_id } = req.params;
  
      const query = "DELETE FROM notifier WHERE id = ?";
  
      await db.query(query, [notify_id]);
  
      res.json({ message: "Society deleted successfully" });
    } catch (error) {
      console.error("Error deleting society:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

