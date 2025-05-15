import  Reservation from "./reservation.model.js";

export const getReservation = async (req, res) =>  {
    const { id } = req.params;
    const reservation = await User
}