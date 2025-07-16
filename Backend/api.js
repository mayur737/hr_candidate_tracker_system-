const { Router, json } = require("express");
const authRoutes = require("./routes/auth.routes");
const candidateRoutes = require("./routes/candidate.routes");
const authenticate = require("./middlewares/authenticate");

const router = Router();

router.use(json());

router.use("/auth", authRoutes);
router.use("/candidate", authenticate, candidateRoutes);

router.use("*", (_, res) => {
  res.status(404).json({ error: "Not Found ❌" });
  console.log("Route Not Found ❌");
});

router.use((error, _, res, __) => {
  res
    .status(error.st ?? 500)
    .json({ error: error.ms ?? "Something went wrong ❗" });
  console.log("Something went wrong ❗", error);
});

module.exports = router;
