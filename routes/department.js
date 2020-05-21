const express       = require('express'),
      router        = express.Router(),
      Department    = require('../models/department')

// INDEX
router.get('/department', async (req, res) => {
    try {
        const depts = await Department.find().sort({ createdAt: -1 })
        res.render('department/index', { depts })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/department', async (req, res) => {
    console.log(req.body)
    try {
        Department.create(req.body)
        res.redirect('/department')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/department/:id/edit', async (req, res) => {
    try {
        const editDept = await Department.findById(req.params.id)
        const depts = await Department.find()
        res.render('department/edit', { depts, editDept })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/department/:id', async (req, res) => {
    try {
        const dept = await Department.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/department')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/department/:id', async (req, res) => {
    try {
        await Department.findByIdAndRemove(req.params.id)
        res.redirect('/department')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router