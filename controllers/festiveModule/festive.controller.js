import { createFestiveDatemodel, deleteByIdFestiveDatemodel, editFestiveDateByIdmodel, getAllFestiveDatemodel, getAllUsers, getFestiveDatesForToday } from "../../models/festive.model.js";
import { sendFestiveSMS } from "../../notification/sendFestiveSMS.js";

export const sendFestiveMessages = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];  // YYYY-MM-DD format
        const festiveDates = await getFestiveDatesForToday(today);

        if (festiveDates.length > 0) {
            for (const festive of festiveDates) {
                const users = await getAllUsers();  
                const message = `Happy ${festive.event_name}! 🎉 Enjoy our special offer!`;

                for (const user of users) {
                    await sendFestiveSMS(user.phone, message);
                }
            }
        }
    } catch (error) {
        console.error('Error during festive messaging process:', error);
    }
};


export const createFestiveDate = async (req, res) => {
    try {
        const { eventName, eventDate } = req.body;

        if(!eventName || !eventDate) {
            return res.status(404).json({ message : "All fields (eventName, eventDate) are required"});
        }

        const result = await createFestiveDatemodel(eventName, eventDate);

        if(!result) {
            return res.status(404).json({ message : "Festive date not created!"});
        }

        return res.status(201).json({ message : "Festive Date Created Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error", error})
    }
}

export const editFestiveDateById = async (req, res) => {
    try {
        const { festiveId } = req.params;
        const { eventName, eventDate } = req.body;

        if(!festiveId) {
            return res.status(404).json({ message : "All fields festive Id are required"});
        }

        const result = await editFestiveDateByIdmodel(eventName, eventDate, festiveId);

        if(!result) {
            return res.status(404).json({ message : "Festive date not update!"});
        }

        return res.status(201).json({ message : "Festive Date Updated Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error", error})
    }
}

export const getAllFestiveDate = async (req, res) => {
    try {
        const result = await getAllFestiveDatemodel();

        if(!result) {
            return res.status(404).json({ message : "Festive date not found"});
        }

        return res.status(201).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error", error})
    }
}


export const deleteFestiveDateById = async (req, res) => {
    try {
        const { festiveId } = req.params;

        if(!festiveId) {
            return res.status(404).json({ message : "festive Id is required!"});
        }

        const result = await deleteByIdFestiveDatemodel(festiveId);

        if(!result) {
            return res.status(404).json({ message : "Festive date not created!"});
        }

        return res.status(201).json({ message : "Festive Date Deleted Successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message : "Internal Server Error", error})
    }
}