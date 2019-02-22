const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const port = process.env.PORT || 3000
// passport stuff 
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const flash = require('connect-flash')


// file upload
const multer = require('multer')
const upload = multer({dest: 'public/uploads'})

//db stuff
const User = require('./models/User')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/customer_app', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

//routes
const routes = require('./routes/index')
const users = require('./routes/users')


var app = express()

// view engine setup
app.set("view engine", "ejs")
//handle file upload
app.use(multer({dest: 'public/uploads'}).single('profileImage'))



app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))

// handle sessions

app.use(session({
    secret: 'secret',
    saveUninitialized:true,
    resave:true
}))


// validator
app.use(expressValidator({
    errorFormatter:(param, msg, value) => {
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root

        while(namespace.length){
            formParam += '['+ namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value : value
        }
    }
}))

// // passport middleware
app.use(passport.initialize()) // initialize passport
app.use(passport.session())
app.use(require('connect-flash')());
app.use((req, res, next) => {
    res.locals.messages = require('express-messages')
    next()
})

app.get("*",(req, res, next) => {
    res.locals.user = req.user || null;
    next()
})
app.use('/', routes)
app.use('/users', users)


//catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})


// error handler


//deveopment error handler
// will print stacktrace
// if(app.get('env') === 'development'){
//     app.use((err, req, res, next) => {
//         res.status(err.status || 500)
//         res.render('error', {
//             message: err.message,
//             error:err
//         })
//     })
// }


// // production error handler
// // no stacktraces leaked to user
// if(app.get('env') === 'development'){
// app.use((err,req, res, next) => {
//     res.status(err.status || 500)
//     res.render('error', {
//         message:err.message,
//         error:{}
//     })
// })
// }

app.listen(port,() => {
    console.log(`Wooo! here we go!... Server running on port ${port}`)
})
module.exports = app
