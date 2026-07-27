import express from "express";

import { getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);


export default router;