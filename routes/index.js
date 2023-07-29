//requires
const auth = require("./authServices");
const values = require("./values");

const mountRoutes = (app) => {
  //mounting routes
  app.use("/api/v1/auth", auth);
  app.use("/api/v1/values", values);
};

module.exports = mountRoutes;
