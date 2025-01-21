import db from '../db/db.js';

export const createVideoModel = async (videoHeading, videoText, status, videoUrl) => {
    try {
        const query = `INSERT INTO videos (video_heading, video_text, status, video_url) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [videoHeading, videoText, status, videoUrl]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('Error in Video Model:', error);
        throw new Error('Database error occurred while saving the video.');
    }
};

export const getAllVideoModel = async () => {
    try {
        const query = 'SELECT * FROM videos';
        const [result] = await db.query(query);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('Error in Video Model:', error);
        throw new Error('Database error occurred while saving the video.');
    }
}

export const getVideoByIdModel = async (videoId) => {
    try {
        const query = 'SELECT * FROM videos WHERE video_id = ?';
        const [result] = await db.query(query, [videoId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('Error in Video Model:', error);
        throw new Error('Database error occurred while saving the video.');
    }
}

// Helper function to update the video in the database
export const updateVideoModel = async (id, videoHeading, videoText, status, videoUrl) => {
    try {
        const query = `UPDATE videos SET video_heading = ?, video_text = ?, status = ?, video_url = ? WHERE video_id = ?`;
        const [result] = await db.query(query, [videoHeading, videoText, status, videoUrl, id]);
        return result;
    } catch (error) {
        console.error('Error in Video Model:', error);
        throw new Error('Database error occurred while updating the video.');
    }
};

// Helper function to get a video by ID (if not already implemented)
export const getVideoByIds = async (id) => {
    const query = `SELECT video_url FROM videos WHERE video_id = ?`;
    const [rows] = await db.query(query, [id]);
    return rows[0]; // Return the first result
};

export const deleteVideoByIdModel = async (videoId) => {
    try {
        const query = 'DELETE FROM videos WHERE video_id = ?';
        const [result] = await db.query(query, [videoId]);
        return result.length === 0 ? null : result;
    } catch (error) {
        console.error('Error in Video Model:', error);
        throw new Error('Database error occurred while saving the video.');
    }
}
