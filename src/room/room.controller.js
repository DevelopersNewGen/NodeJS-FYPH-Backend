import Room from './room.model.js';

export const createRoom = async (req, res) => {

    try {
        const { name, description, capacity, pricePerDay, type} = req.body;
         const images = req.imgs;
        const newRoom = new Room({ name, description, capacity, pricePerDay, type, images});
        await newRoom.save();
        console.log("hola");
        return res.status(201).json({
            success: true,
            message: 'Room created successfully',
            room: newRoom
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating room',
            error: error.message
        });
    }
}

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        return res.status(200).json({
            success: true,
            rooms
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching rooms',
            error: error.message
        });
    }
}