import db from "../../db/db.js";

export const createSociety = async (req, res) => {
  try {
    const { society_name, pin_code, address } = req.body;
    if (!society_name || !pin_code || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const sql =
      "INSERT INTO Sociaty (society_name, pin_code, address) VALUES (?, ?, ?)";
    const [result] = await db.query(sql, [society_name, pin_code, address]);

    console.log(result);

    res.json({ message: "Society added successfully" });
  } catch (error) {
    console.error("Error adding society:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getallsociety = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM Sociaty");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching Sociaty:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteSocietbytId = async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM Sociaty WHERE id = ?";

    await db.query(query, [id]);

    res.json({ message: "Society deleted successfully" });
  } catch (error) {
    console.error("Error deleting society:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getallsocity = async ()
