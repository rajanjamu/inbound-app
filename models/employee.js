const mongoose = require('mongoose')
const Department = require('./department')

const employeeSchema = new mongoose.Schema({
    name: String,
    mobileNumber: String,
    department: {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: Department
        },
        name: String
    },
    smsStatus: Boolean
}, {
    timestamps: true
})

module.exports = mongoose.model('Employee', employeeSchema)