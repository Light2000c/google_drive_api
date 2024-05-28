const express = require("express");
const { UploadToDrive } = require("../controller/index");

const router = express.Router();


router.post("/upload", UploadToDrive);

module.exports  = router;