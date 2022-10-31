
const express = require("express");
const { fileUploads, userCreate, userLogin } = require("../Controllers/appContro");
const router = express.Router();


router.post("/file/upload",fileUploads);

router.post("/user/create",userCreate)


router.post("/user/login",userLogin)

module.exports = router