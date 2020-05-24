const mongoose = require('mongoose')
const Department = require('./department')
const Channel = require('./channel')

const employeeSchema = new mongoose.Schema({
    name: String,
    mobileNumber: String,
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