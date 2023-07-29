const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");

require("dotenv").config();
require("./config/db")();

app.use(express.json());
app.use(cors());

app.use(compression());

//requires
const globalErrorHandling = require("./middleware/error_middleware");
const ApiError = require("./utils/ApiError");

//mount routing
require("./routes")(app);

app.all("*", (req, res, next) =>
  //Create an error and send it to error handling middleware
  next(new ApiError(`Can't find this route : ${req.originalUrl}`, 400))
);

//global error handling for express
app.use(globalErrorHandling);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app running success`);
});

//handling exception out express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("server closed ...");
    process.exit(1);
  });
});
