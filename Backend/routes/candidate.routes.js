const {
  addCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
  bulkUpload,
  dailyStats,
} = require("../controllers/candidate.controller");

const router = require("express").Router();

router.post("/", addCandidate);
router.post("/bulk-upload", bulkUpload);
router.get("/", getAllCandidates);
router.get("/stats", dailyStats);
router.get("/:id", getCandidate);
router.put("/:id", updateCandidate);
router.put("/status/:id", updateCandidateStatus);
router.delete("/:id", deleteCandidate);

module.exports = router;
