import Reservation from "./reservation.model.js";
import Room from "../room/room.model.js";
import Hotel from "../hotel/hotel.model.js";

export const createReservation = async (req, res) => {
    try {
        const data = req.body;

        const room = await Room.findById(data.room);
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Habitación no encontrada"
            });
        }
        if (!room.status) {
            return res.status(400).json({
                success: false,
                message: "La habitación no está disponible"
            });
        }

        const reservation = await Reservation.create(data);

        room.status = false;
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

export const updateReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const { room: newRoomId, ...data } = req.body;

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }

        if (newRoomId && String(newRoomId) !== String(reservation.room)) {

            const newRoom = await Room.findById(newRoomId);
            if (!newRoom) {
                return res.status(404).json({
                    success: false,
                    message: "Nueva habitación no encontrada"
                });
            }
            if (!newRoom.status) {
                return res.status(400).json({
                    success: false,
                    message: "La nueva habitación no está disponible"
                });
            }

            const oldRoom = await Room.findById(reservation.room);
            if (oldRoom) {
                oldRoom.status = true;
                await oldRoom.save();
            }

            newRoom.status = false;
            await newRoom.save();

            data.room = newRoomId;
        }

        const updated = await Reservation.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Reservación no encontrada"
            });
        }
        res.status(200).json({
            success: true,
            message: "Reservación actualizada",
            reservation: updated
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar la reservación",
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
            const room = await Room.findById(reservation.room);
            if (room) {
                room.status = true;
                await room.save();
            }
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
