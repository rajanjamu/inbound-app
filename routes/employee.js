const express       = require('express'),
      router        = express.Router(),
      Employee      = require('../models/employee'),
      Department    = require('../models/department'),
      Channel       = require('../models/channel'),
      { timeAgo }   = require('../utils/helper')

// NEW
router.get('/employee/new', async (req, res) => {
    const depts = await Department.find()
    const channels = await Channel.find()
    res.render('employee/new', { depts, channels })
})

// INDEX
router.get('/employee', async (req, res) => {
    let filter = {}
    const { channel, department } = req.query

    if (channel && channel != 'Select Chnl') {
        filter.channel = channel
    }
    if (department && department != 'Select Dept') {
        filter.department = department
    }

    try {
        const employees = await Employee
                            .find(filter)
                            .populate('channel')
                            .populate('department')
                            .sort({ updatedAt: -1 })
                            .lean()
        
        employees.forEach(emp => emp.timeAgo = timeAgo(emp.updatedAt))

        const channels = await Channel.find()
        const depts = await Department.find()

        res.render('employee/index', { employees, channels, depts, filter })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/employee', async (req, res) => {  
    try {
        const employee = new Employee({
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            department: req.body.deptId,
            channel: req.body.chnlId,
            isSendSMS: req.body.isSendSMS ? true : false
        })
        employee.save()
        req.flash('success', `New employee - ${employee.name} - created!`)
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/employee/:id/edit', async (req, res) => {
    try {
        let employee = await Employee.findById(req.params.id)
        employee = await employee.populate('channel', 'name')
                        .populate('department', 'name')
                        .execPopulate()

        const depts = await Department.find()
        const channels = await Channel.find()
        console.log(employee)
        res.render('employee/edit', { employee, depts, channels })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/employee/:id', async (req, res) => {
    try {
        req.body.isSendSMS = (req.body.isSendSMS ? true : false)
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true })
        req.flash('success', `Employee - ${employee.name} - updated!`)
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/employee/:id', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndRemove(req.params.id)
        req.flash('success', `Employee - ${employee.name} - deleted!`)
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router