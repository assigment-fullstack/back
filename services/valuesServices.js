const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const Values = require('../models/values')



exports.addValue = asyncHandler(async (req, res, next) => {
    const { value } = req.body;
    if (!value) {
        return next(new ApiError("value is required", 422));
    }
    const newNumber = await Values.create({ value });
    res.status(201).json(newNumber);
})

exports.getValues = asyncHandler(async (req, res, next) => {
    const numbers = await Values.find({});
    return res.json(numbers);
})


exports.updateValues = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { value } = req.body;
    if (!id || !value) {
        return next(new ApiError("value and id are required", 422));
    }
    const updatedNumber = await Values.findByIdAndUpdate(id, { value }, { new: true });
    return res.json(updatedNumber);
})

exports.deleteValues = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return next(new ApiError("id is required", 422));
    }
    await Values.findByIdAndRemove(id);
    return res.json({ message: 'Number deleted successfully' });
})

