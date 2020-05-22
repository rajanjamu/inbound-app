const express       = require('express'),
      router        = express.Router(),
      Employee      = require('../models/employee'),
      Department    = require('../models/department'),
      Channel    = require('../models/channel')

// INDEX
router.get('/employee', async (req, res) => {
    let filter = {}

    if (req.query.deptName && req.query.deptName != 'Select Department') {
        filter = req.query
    }

    try {
        const employees = await Employee.find(filter).sort({ createdAt: -1 })
        const depts = await Department.find()
        res.render('employee/index', { employees, depts })
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
        const dept = await Department.findOne({ name: req.body.deptName })
        const chnl = await Channel.findOne({ name: req.body.chnlName })
        const employee = new Employee({
            name: req.body.name,
            mobileNumber: req.body.mobileNumber,
            'department._id': dept._id,
            'department.name': dept.name,
            'channel._id': chnl._id,
            'channel.name': chnl.name
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