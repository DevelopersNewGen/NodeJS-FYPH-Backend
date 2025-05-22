import { Router } from "express";
import {
    createReservation,
    getReservationById,
    deleteReservation,
    getReservationsByRoom
} from "./reservation.controller.js";
import { 
    reserveRoomValidator,
    cancelReservationValidator,
 } from "../middlewares/reservation-validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: API for managing reservations
 */

/**
 * @swagger
 * /createReser:
 *   post:
 *     summary: Crea una nueva reservación
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Reservación creada exitosamente
 *       500:
 *         description: Error al crear la reservación
 */
router.post("/createReser/:rid",reserveRoomValidator, createReservation);

/**
 * @swagger
 * /listReser/{rid}:
 *   get:
 *     summary: Obtiene una reservación por ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación encontrada
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error al obtener la reservación
 */
router.get("/listReser/:rid", getReservationById);


/**
 * @swagger
 * /deleteReser/{rid}:
 *   delete:
 *     summary: Elimina (soft delete) una reservación por ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la reservación
 *     responses:
 *       200:
 *         description: Reservación eliminada
 *       404:
 *         description: Reservación no encontrada
 *       500:
 *         description: Error al eliminar la reservación
 */
router.delete("/deleteReser/:rid",cancelReservationValidator, deleteReservation);

/**
 * @swagger
 * /listReserByRoom/{rid}:
 *   get:
 *     summary: Obtiene todas las reservaciones de una habitación por ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: rid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Reservaciones encontradas
 *       404:
 *         description: Reservaciones no encontradas
 */
router.get("/listReserByRoom/:rid", getReservationsByRoom);

export default router;