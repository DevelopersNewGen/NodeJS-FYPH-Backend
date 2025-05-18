import Event from './event.model.js';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: true })
            .populate('hotel', '.name')
              .populate({path: "adminEvent",select: "name -_id"});

        res.status(200).json({
            success: true,
            events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los eventos",
            error: error.message
        });
    }
};


export const getEventById = async (req, res) => {
    try {
        const { eid } = req.params;
        const event = await Event.findById(eid)
            .populate('hotel', 'name') 
            .populate('adminEvent', 'name') 

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            event: event,
            message: 'Event found'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { usuario } = req;
        const data = req.body;
        data.adminEvent = usuario._id;

        const newEvent = new Event(data);
        await newEvent.save();

        res.status(201).json({
            success: true,
            event: newEvent,
            message: 'Event created successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { eid } = req.params;
        const data = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(eid, data, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            event: updatedEvent,
            message: 'Event updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { eid } = req.params;
        const deletedEvent = await Event.findByIdAndUpdate(eid, { status: false }, { new: true });

        if (!deletedEvent) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
};

export const getEventsByHost = async (req, res) => {
    try {
        const { eid } = req.params;
        const events = await Event.find({ adminEvent: eid, status: true })
            .populate('hotel', 'name') 
            .populate('adminEvent', 'name') 
            .select('-category'); 

        if (!events || events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No events found for this host'
            });
        }

        res.status(200).json({
            success: true,
            events: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};
