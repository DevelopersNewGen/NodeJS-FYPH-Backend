import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js";
import Hotel from "../hotel/hotel.model.js";

export const createReservation = async (req, res) => {
    try {
        const { rid } = req.params; 
        const {usuario} = req;
        const { startDate, extiDate, ...otherData } = req.body;
        const room = await Room.findById(rid);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Habitación no encontrada"
            });
        }

        const reservationData = {
            startDate,
            extiDate,
            user: usuario._id,
            room: room._id,
            ...otherData
        };
        const reservation = await Reservation.create(reservationData);

        room.reservations.push(reservation.rid);
        await room.save();

        if (room.hotel) {
            await Hotel.findByIdAndUpdate(
                room.hotel,
                { $push: { reservations: reservation._id } }
            );
        }

        res.status(201).json({
            success: true,
            message: "Reservación creada exitosamente",
            reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al crear la reservación",
            error: err.message
        });
    }
};

export const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await Reservation.findById(id);
        if (!reservation || !reservation.status) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la reservación",
            error: err.message
        });
    }
};


export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }

        if (reservation.room) {
            await Room.findByIdAndUpdate(
                reservation.room,
                { $pull: { reservations: reservation._id } }
            );
        }

        if (reservation.room) {
            const room = await Room.findById(reservation.room);
            if (room && room.hotel) {
                await Hotel.findByIdAndUpdate(
                    room.hotel,
                    { $pull: { reservations: reservation._id } }
                );
            }
        }

        const deleted = await Reservation.findByIdAndUpdate(id, { status: false }, { new: true });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            message: "Reservación eliminada",
            reservation: deleted
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la reservación",
            error: err.message
        });
    }
};
