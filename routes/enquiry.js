const express   = require('express'),
      router    = express.Router(),
      Enquiry   = require('../models/enquiry'),
      Department= require('../models/department'),
      Channel   = require('../models/channel'),
      sendSMS   = require('../utils/sms'),
      { timeAgo } = require('../utils/helper')

router.get('/', (req, res) => {
    res.redirect('/enquiry/1')
})

router.get('/enquiry', (req, res) => {
    res.redirect('/enquiry/1')
})

// NEW
router.get('/enquiry/new', async (req, res) => {
    const depts = await Department.find()
    const channels = await Channel.find()
    res.render('enquiry/new', { depts, channels })
})

// INDEX
router.get('/enquiry/:page', async (req, res) => {
    let filter = {}
    const perPage = 5
    const page = req.params.page || 1

    if (req.query.deptName && req.query.deptName != 'Select Dept') {
        filter.deptName = req.query.deptName
    }
    if (req.query.channelName && req.query.channelName != 'Select Chnl') {
        filter.channelName = req.query.channelName
    }

    try {
        let enqs = await Enquiry
                        .find(filter)
                        .limit(perPage)
                        .skip(perPage * (page - 1))
                        .sort({ updatedAt: -1 })
                        .lean()
        
        enqs.forEach(enq => enq.timeAgo = timeAgo(enq.updatedAt))
                        
        const depts = await Department.find()
        const channels = await Channel.find()

        const countEnqs = await Enquiry.countDocuments(filter)
        const pages = Math.ceil(countEnqs/perPage)

        res.render('enquiry/index', { enqs, filter, page, pages, depts, channels })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/enquiry', async (req, res) => {
    try {
        const enq = await Enquiry.create(req.body)
        sendSMS(enq)
        res.redirect('/enquiry')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/enquiry/:id/edit', async (req, res) => {
    try {
        const enq = await Enquiry.findById(req.params.id)
        const depts = await Department.find()
        const channels = await Channel.find()
        res.render('enquiry/edit', { enq, depts, channels })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/enquiry/:id', async (req, res) => {
    try {
        const enq = await Enquiry.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/enquiry/:id', async (req, res) => {
    try {
        await Enquiry.findByIdAndRemove(req.params.id)
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})



module.exports = router
