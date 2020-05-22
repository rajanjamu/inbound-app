const express       = require('express'),
      router        = express.Router(),
      Channel    = require('../models/channel')

// INDEX
router.get('/channel', async (req, res) => {
    try {
        const channels = await Channel.find().sort({ createdAt: -1 })
        res.render('channel/index', { channels })
    } catch (e) {
        console.log(e)
    }
})

// CREATE
router.post('/channel', async (req, res) => {
    try {
        Channel.create(req.body)
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
})

// 5. EDIT
router.get('/channel/:id/edit', async (req, res) => {
    try {
        const editChnl = await Channel.findById(req.params.id).sort({ createdAt: -1 })
        const channels = await Channel.find()
        res.render('channel/edit', { channels, editChnl })
    } catch (e) {
        console.log(e)
    }
});

// 6. UPDATE
router.put('/channel/:id', async (req, res) => {
    try {
        const dept = await Channel.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
});

// DELETE
router.delete('/channel/:id', async (req, res) => {
    try {
        await Channel.findByIdAndRemove(req.params.id)
        res.redirect('/channel')
    } catch (e) {
        console.log(e)
    }
})

module.exports = router