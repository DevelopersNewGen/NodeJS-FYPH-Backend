import { Router } from "express"
import { generateBill } from "./bill.controller.js"
import { generateBillValidator } from "../middlewares/bill-validator.js"

const router = Router()

/**
 * @swagger
 * /bills/generate:
 *   post:
 *     summary: Generar una factura a partir de una reservación
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rid:
 *                 type: string
 *                 description: ID de la reservación
 *     responses:
 *       201:
 *         description: Factura generada correctamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Reservación no encontrada
 */
router.post("/generate", generateBillValidator, generateBill);
