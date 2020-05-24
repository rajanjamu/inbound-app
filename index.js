const path              = require('path')
const express           = require('express')
const bodyParser        = require('body-parser')
const mongoose          = require('mongoose')
const methodOverride    = require('method-override')
const flash             = require('connect-flash')
const session           = require('express-session')
const app               = express()

const enqRoutes = require('./routes/enquiry')
const deptRoutes = require('./routes/department')
const chnlRoutes = require('./routes/channel')
const emplRoutes = require('./routes/employee')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/inbound_app', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

const port = process.env.PORT || 3000
app.set('view engine', 'ejs')
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'inbound',
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.error = req.flash('error')
    res.locals.success = req.flash('success')
    next()
})

app.use(enqRoutes)
app.use(deptRoutes)
app.use(chnlRoutes)
app.use(emplRoutes)

app.listen(port, () => {
    console.log('App is running at port ' + port)
})