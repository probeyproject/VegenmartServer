import { createVideoModel, deleteVideoByIdModel, getAllVideoModel, getVideoByIdModel, getVideoByIds, updateVideoModel } from '../../models/video.model.js';
import cloudinary from '../../config/cloudinary.js';
import upload from '../../config/multer.js';      

export const uploadVideo = async (req, res) => {
    try {
        const { videoHeading, videoText, status } = req.body;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No video file uploaded.'
            });
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'video'
        });

        const videoUrl = result.secure_url;

        const videoData = await createVideoModel(videoHeading, videoText, status, videoUrl);
        return res.status(201).json({ success: true, message: 'Video uploaded successfully!', data: videoData});
    } catch (error) {
        console.error('Error in Video Upload Controller:', error);
        return res.status(500).json({success: false,message: 'An error occurred while uploading the video. Please try again later.'});
    }
};

export const getAllVideo = async (req, res) => {
    try {
        const result = await getAllVideoModel();

        if(!result) {
            return res.status(400).json({ message: 'Video not found!'});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in Video Upload Controller:', error);
        return res.status(500).json({success: false,message: 'An error occurred while uploading the video. Please try again later.'});
    }
}

export const getVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        if(!videoId) {
            return res.status(400).json({ message: 'Vedio Id is required!'});
        }
        const result = await getVideoByIdModel(videoId);

        if(!result) {
            return res.status(400).json({ message: 'Video not found!'});
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error in Video Upload Controller:', error);
        return res.status(500).json({success: false,message: 'An error occurred while uploading the video. Please try again later.'});
    }
}

export const editVideoById = async (req, res) => {
    try {
        const { id } = req.params;
        const { videoHeading, videoText, status } = req.body;

        // Validate input
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'Video ID is required.'
            });
        }

        let videoUrl;

        // If a new video file is uploaded, handle the upload
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: 'video'
            });
            videoUrl = result.secure_url; // Get the new video URL
        } else {
            // If no new file is provided, fetch the current video URL from the database
            const currentVideo = await getVideoByIds(id);
            if (!currentVideo) {
                return res.status(404).json({
                    success: false,
                    message: 'Video not found.'
                });
            }
            videoUrl = currentVideo.video_url; // Use the existing URL
        }

        // Update the video details in the database
        const videoData = await updateVideoModel(id, videoHeading, videoText, status, videoUrl);
        return res.status(200).json({ success: true, message: 'Video updated successfully!', data: videoData });
    } catch (error) {
        console.error('Error in Video Edit Controller:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the video. Please try again later.' });
    }
}



export const deleteVideoById = async (req, res) => {
    try {
        const { videoId } = req.params;

        if(!videoId) {
            return res.status(400).json({ message: 'Vedio Id is required!'});
        }
        const result = await deleteVideoByIdModel(videoId);

        if(!result) {
            return res.status(400).json({ message: 'Video not found!'});
        }

        return res.status(200).json({ message : "Video Deleted Successfully!" });
    } catch (error) {
        console.error('Error in Video Upload Controller:', error);
        return res.status(500).json({success: false,message: 'An error occurred while uploading the video. Please try again later.'});
    }
}
