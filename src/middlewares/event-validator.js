import { check, param, body, validationResult } from 'express-validator';
import { validateJWT } from "./validate-jwt.js" 
import { hasRoles } from './validate-roles.js';
import { validateField } from "./validate-fields.js" 
import { handleErrors } from "./handle-errors.js" 

// Validador para crear un evento
export const createEventValidator = [
    validateJWT,
    body('name').notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('description').notEmpty().withMessage('Description is required').isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
    body('date').notEmpty().withMessage('Date is required').isISO8601().withMessage('Date must be a valid date'),
    body('time').notEmpty().withMessage('Time is required'),
    body('location').notEmpty().withMessage('Location is required').isLength({ max: 100 }).withMessage('Location cannot exceed 100 characters'),
    body('category').notEmpty().withMessage('Category is required').isIn(['weding', 'party', 'business', 'other']).withMessage('Invalid category'),
    //body('hotel').notEmpty().withMessage('Hotel ID is required').isMongoId().withMessage('Hotel must be a valid ID'),
    body('cost').notEmpty().withMessage('Cost is required').isNumeric().withMessage('Cost must be a number'),
];
export const generalValidator=[
    validateJWT,
    hasRoles('ADMIN_ROLE', 'HOST_ROLE'), 
    param('eid').isMongoId().withMessage('Invalid event ID'),
    validateField,
    handleErrors
]

export const deleteEventValidator = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'HOST_ROLE', 'USER_ROLE'),
    param('eid').isMongoId().withMessage('Invalid event ID'),
    validateField,
    handleErrors
];
export const validateSearchByHost = [
    validateJWT,
    hasRoles('ADMIN_ROLE', 'HOST_ROLE', 'USER_ROLE'),
    param('eid').isMongoId().withMessage('Invalid event ID'),
];

export const updateEventValidator = [
    validateJWT,
    param('eid').isMongoId().withMessage('Invalid event ID'),
    body('name').optional().isLength({ max: 50 }).withMessage('Event name must be at most 50 characters'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description must be at most 500 characters'),
    body('date').optional().isISO8601().withMessage('Date must be a valid date'),
    body('location').optional().isLength({ max: 100 }).withMessage('Location must be at most 100 characters'),
    body('category').optional().isIn(['wedding', 'party', 'business', 'other']).withMessage('Invalid category'),
    body('cost').optional().isNumeric().withMessage('Cost must be a valid number'),
    validateField,
    handleErrors
];