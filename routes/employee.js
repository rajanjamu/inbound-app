const express       = require('express'),
      router        = express.Router(),
      Employee      = require('../models/employee'),
      Department    = require('../models/department'),
      Channel       = require('../models/channel'),
      { timeAgo }   = require('../utils/helper')

// INDEX
router.get('/employee', async (req, res) => {
    let filter = {}
    const { channel, department } = req.query

    if (channel && channel.name != 'Select Chnl') {
        filter['channel.name'] = channel.name
    }
    if (department && department.name != 'Select Dept') {
        filter['department.name'] = department.name
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

// NEW
router.get('/employee/new', async (req, res) => {
    const depts = await Department.find()
    const channels = await Channel.find()
    res.render('employee/new', { depts, channels })
})

// CREATE
router.post('/employee', async (req, res) => {  
    try {
        console.log(req.body.deptName)
        // const dept = await Department.findById(req.body.deptId)
        // const chnl = await Channel.findOne(req.body.chnlId)
        const employee = new Employee({
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            department: req.body.deptId,
            channel: req.body.chnlId
        })
        employee.save()
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/employee/:id/edit', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id)
        const depts = await Department.find()
        const channels = await Channel.find()
        res.render('employee/edit', { employee, depts, channels })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/employee/:id', async (req, res) => {
    try {
        const dept = await Employee.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/employee/:id', async (req, res) => {
    try {
        await Employee.findByIdAndRemove(req.params.id)
        res.redirect('/employee')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router