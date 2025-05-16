import { Router } from "express";
import { createRoom, getRooms } from "./room.controller.js";
import { validateCrateRoom } from "../middlewares/room-validator.js";
import { uploadRoomImage } from "../middlewares/multer-uploads.js";
import {  cloudinaryUploadMultiple } from "../middlewares/img-uploads.js";

const router = Router();

router.post("/createRoom", uploadRoomImage.array("images", 5), cloudinaryUploadMultiple("rooms-img"), validateCrateRoom, createRoom);

router.get("/getRooms", getRooms);

export default router;