import {body} from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { deleteFileOnError } from "./delete-file-on-error.js";


export const validateCrateRoom = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "HOST_ROLE"),
    body("name").notEmpty().withMessage("Name is required").isLength({max: 35}).withMessage("Name cannot exceed 35 characters"),
    body("description").notEmpty().withMessage("Description is required").isLength({max: 100}).withMessage("Description cannot exceed 100 characters"),
    body("capacity").notEmpty().withMessage("Capacity is required").isLength({max: 5}).withMessage("Capacity cannot exceed 5 characters"),
    body("pricePerDay").notEmpty().withMessage("Price per day is required").isNumeric().withMessage("Price per day must be a number"),
    body("type").notEmpty().withMessage("Type is required").isIn(["SINGLE", "DOUBLE", "SUITE", "DELUXE"]).withMessage("Type must be one of the following: SINGLE, DOUBLE, SUITE, DELUXE"),
    validateField,
    deleteFileOnError,
    handleErrors
]
