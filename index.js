const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express()

const enqRoutes = require('./routes/enquiry')
const deptRoutes = require('./routes/department')
const employeeRoutes = require('./routes/employee')

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

app.use(enqRoutes)
app.use(deptRoutes)
app.use(employeeRoutes)

app.listen(port, () => {
    console.log('App is running at port ' + port)
})