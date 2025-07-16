const Candidate = require("../models/Candidate.model");

const addCandidate = async (req, res, next) => {
  try {
    const { name, phone, email, experience, status, skills, note, location } =
      req.body;
    const existing = await Candidate.findOne({ email });
    if (existing)
      return next({ st: 400, ms: "Candidate with this email already exists!" });
    await Candidate.create({
      name,
      phone,
      experience,
      status,
      skills,
      note,
      location,
    });
    res.status(201).json({ data: { message: "Candidate added successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getAllCandidates = async (req, res, next) => {
  try {
    const { n = 1, p = 0, status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
        { skills: searchRegex },
        { status: searchRegex },
        { note: searchRegex },
        { location: searchRegex },
      ];
    }
    const candidates = await Candidate.find(filter)
      .skip(p * n)
      .limit(+n)
      .sort("-_id")
      .lean();
    const count = await Candidate.countDocuments(filter);
    res.status(200).json({ data: { candidates, count } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const getCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    console.log(candidate);

    if (!candidate) return next({ st: 400, ms: "Candidate not found!" });
    res.status(200).json({ data: { candidate } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updateCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, phone, email, experience, status, skills, note } = req.body;
    const candidate = await Candidate.findById(id);
    if (!candidate) return next({ st: 400, ms: "Candidate not found!" });

    if (name !== undefined) candidate.name = name;
    if (phone !== undefined) candidate.phone = phone;
    if (email !== undefined) candidate.email = email;
    if (experience !== undefined) candidate.experience = experience;
    if (status !== undefined) candidate.status = status;
    if (skills !== undefined) candidate.skills = skills;
    if (note !== undefined) candidate.note = note;
    if (location !== undefined) candidate.location = location;

    await candidate.save();
    res
      .status(200)
      .json({ data: { message: "Candidate updated successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const updateCandidateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const candidate = await Candidate.findById(id);
    if (!candidate) return next({ st: 400, ms: "Candidate not found!" });
    if (status !== undefined) candidate.status = status;
    await candidate.save();
    res
      .status(200)
      .json({ data: { message: "Status of candidate updated successfully" } });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return next({ st: 400, ms: "Candidate not found!" });
    await Candidate.findByIdAndDelete(id);

    res.status(200).json({
      data: {
        message: "Candidate deleted successfully",
      },
    });
  } catch (error) {
    console.log(error);
    next({ st: 500, ms: error.message });
  }
};

const bulkUpload = async (req, res, next) => {
  try {
    const details = req.body || [];
    let successCount = 0;
    let skippedCount = 0;

    for (const data of details) {
      try {
        const existingCandidate = await Candidate.findOne({
          email: data.email,
        });

        if (existingCandidate) {
          skippedCount++;
          continue;
        }
        const candidate = await Candidate.create({
          name: data.name,
          email: data.email,
          phone: data.phone,
          experience: data.experience,
          location: data.location,
          skills: data.skills,
        });
        await candidate.save();
        successCount++;
      } catch (err) {
        console.log(err);
      }
    }
    res.status(200).json({
      data: {
        message: `Bulk Upload Completed. ${successCount} records uploaded successfully, ${skippedCount} records skipped due to duplicate emails.`,
      },
    });
  } catch (error) {
    console.error(error);
    next({ st: 500, ms: error.message });
  }
};

const dailyStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const aggregationResult = await Candidate.aggregate([
      {
        $match: {
          $or: [
            { createdAt: { $gte: startOfToday, $lte: endOfToday } },
            { updatedAt: { $gte: startOfToday, $lte: endOfToday } },
          ],
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const totalCalls = aggregationResult.reduce(
      (acc, cur) => acc + cur.count,
      0
    );

    const countsByStatus = {};
    aggregationResult.forEach((item) => {
      countsByStatus[item._id] = item.count;
    });
    res.status(200).json({
      data: { totalCalls, countsByStatus },
    });
  } catch (error) {
    console.error(error);
    next({ st: 500, ms: error.message });
  }
};

module.exports = {
  addCandidate,
  getAllCandidates,
  getCandidate,
  updateCandidate,
  deleteCandidate,
  updateCandidateStatus,
  bulkUpload,
  dailyStats,
};
