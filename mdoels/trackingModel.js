const mongoose = require("mongoose");

const tarckingSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        foodId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "foods",
            required: true,
        },
        quantity: {
            type: Number,
            min: 1,
            required: true,
        },
    },
    {timestamps:true}
);

const TrackingModel = mongoose.model("Traking", tarckingSchema);
module.exports = TrackingModel;