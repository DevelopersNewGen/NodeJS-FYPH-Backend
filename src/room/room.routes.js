import { Router } from "express";
import { createRoom } from "./room.controller.js";
import { validateCrateRoom } from "../middlewares/room-validator.js";
import { uploadRoomImage } from "../middlewares/multer-uploads.js";
import {  cloudinaryUploadMultiple } from "../middlewares/img-uploads.js";

const router = Router();

router.post(
    "/createRoom", uploadRoomImage.array("images", 5), cloudinaryUploadMultiple("rooms-img"), validateCrateRoom, createRoom);

export default router;