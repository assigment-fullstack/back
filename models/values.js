const mongoose = require("mongoose");

const valuesSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: true,
    }});

module.exports = mongoose.model("Values", valuesSchema);
