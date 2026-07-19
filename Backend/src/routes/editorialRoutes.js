const express = require("express");

const editorialRouter = express.Router();

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    saveEditorial,
    getEditorial
} = require("../controllers/editorialController");

// Save or Update Editorial
editorialRouter.post(
    "/save",
    adminMiddleware,
    saveEditorial
);

// Get Editorial
editorialRouter.get(
    "/:problemId",
    userMiddleware,
    getEditorial
);

module.exports = editorialRouter;