const { signIn } = require("../controllers/auth.controller");

const router = require("express").Router();

router.post("/signin", signIn);

module.exports = router;
