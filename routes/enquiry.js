const express   = require('express'),
      router    = express.Router(),
      Enquiry   = require('../models/enquiry'),
      Department= require('../models/department'),
      Channel   = require('../models/channel'),
      sendSMS   = require('../utils/sms'),
      { timeAgo } = require('../utils/helper')

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
    const { channel, department } = req.query
    const perPage = 5
    const page = req.params.page || 1

    if (channel && channel != 'Select Chnl') {
        filter.channel = channel
    }
    if (department && department != 'Select Dept') {
        filter.department = department
    }

    try {
        let enqs = await Enquiry
                        .find(filter)
                        .populate('channel')
                        .populate('department')
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
        let enq = await Enquiry.create(req.body)
        enq = await enq.populate('channel', 'name')
                       .populate('department', 'name')
                       .execPopulate()

        if (req.body.isSendSMS) {
            sendSMS(enq)
        }
        
        req.flash('success', `New enquiry created! ${ req.body.isSendSMS ? 'SMS sent.' : '' }`)
        res.redirect('/enquiry/1')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/enquiry/:id/edit', async (req, res) => {
    try {
        let enq = await Enquiry.findById(req.params.id)
        enq = await enq.populate('channel', 'name')
                        .populate('department', 'name')
                        .execPopulate()

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
        let smsStatus = false
        let enq = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true })
        enq = await enq.populate('channel', 'name')
                       .populate('department', 'name')
                       .execPopulate()

        if (req.body.isSendSMS) {
            smsStatus = await sendSMS(enq)

            if (smsStatus) {
                req.flash('success', `Enquiry updated! SMS sent.`)
            } else {
                req.flash('error', `Enquiry updated! No number associated for SMS notification.`)
            }
        } else {
            req.flash('success', `Enquiry updated!`)
        }

        res.redirect('/enquiry/1')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/enquiry/:id', async (req, res) => {
    try {
        const enq = await Enquiry.findByIdAndRemove(req.params.id)
        req.flash('success', `Enquiry deleted!`)
        res.redirect('/enquiry/1')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router
