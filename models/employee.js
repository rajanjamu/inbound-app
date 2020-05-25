const mongoose = require('mongoose')
const Department = require('./department')
const Channel = require('./channel')

const employeeSchema = new mongoose.Schema({
    name: String,
    mobileNumber1: {
        type: String,
        validate: /^[6-9]\d{9}$/
    },
    mobileNumber2: {
        type: String,
        validate: /^$|^[6-9]\d{9}$/,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Department,
        required: true
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Channel,
        required: true
    },
    isSendSMS: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', employeeSchema)