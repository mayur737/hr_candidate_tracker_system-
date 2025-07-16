const Hr = require("./models/Hr.model");

const initialize = async () => {
  const hr = await Hr.findOne().lean();
  if (!hr) {
    const superHr = new Hr({
      email: "superhr@gmail.com",
      password: "Superhr@123",
    });
    await superHr.save();
    console.log("Super Hr created.");
  } else {
    console.log("Super Hr already exists.");
  }
};

module.exports = initialize;
