const express = require("express");

const routes = express.Router();

const {
    addValue,
    getValues,
    updateValues,
    deleteValues
} = require("../services/valuesServices");


routes
    .route("/")
    .post(addValue)
    .get(getValues);

routes.route("/:id").put(updateValues).delete(deleteValues);



module.exports = routes;
