const mongoose = require ('mongoose');

const PinSchema = new mongoose.Schema({
    username: {
        type:String,
        require:true,
    },
    title:{
        type: String,
        require: true,
        min:5,
    },
    description:{
        type: String,
        require: true,
        min:10,
    },
    rating:{
        type: Number,
        require: true,
        min:0,
        max: 5,
    },
    lat:{
        type: Number,
        require: true,
    },
    long:{
        type: Number,
        require: true,
    },
}, {timestamps:true}
);

module.exports = mongoose.model("Pin",PinSchema)