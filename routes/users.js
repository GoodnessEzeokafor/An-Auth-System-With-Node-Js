const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User')


//file upload
const multer = require('multer')
const upload = multer({dest: 'public/uploads'})

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index')
})


passport.serializeUser((user, done) => {
    done(null, user.id)
})
passport.deserializeUser((id,done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(new LocalStrategy(
    (username, password, done)=> {
        User.findOne({username: username}, (err, user) => {
            if(err){ return done(err); }
            if(!user){
                return done(null, false, {message: "Incorrect username."})
            }
            if(!bcrypt.compareSync(password, user.password)){
                console.log(password)/////
                console.log(user.password)
                return done(null, false, {message:'Incorrect password '})
            }
            return done(null, user)
        })
    }
))
router.route('/login')
    .get((req, res) => {
        res.render('login', {title:'Login'})
    })
    .post(passport.authenticate('local',{
        failureRedirect:'/users/login',
        failureFlash:'Invalid Username or Password'
    }), (req, res) => {
        console.log(req.body.username)
        console.log(req.body.password)
        req.flash('success', 'You are now logged in')
        res.redirect('/')
    })


    
router.route("/register")
        .get((req, res) => {
            res.render('register', {title:'Regster'})
        })
        .post((req, res) => {

            var name = req.body.name;
            var email = req.body.email;
            var username = req.body.username;
            var password = req.body.password;
            var password2 = req.body.password2;
            
            console.log(req.file)

            // if ther is a file
            if(req.file){
                console.log("Uploading file...")
                var profileImage = req.file.filename
                console.log(profileImage)
            } else {
                console.log('No file uploaded')
                var profileImage = 'noimage/jpg'
            }

            // form validator
            req.checkBody('name', 'Name field is required').notEmpty();
            req.checkBody('email', 'Email field is required').isEmail();
            req.checkBody('username', 'Username field is required').notEmpty();
            req.checkBody('password', 'Password field is required').notEmpty();
            req.checkBody('password2', 'Confirm-password field is required').notEmpty();
            

            // check errors
            let errors = req.validationErrors()
            if(errors){
                res.render('register', {errors:errors})
            } else{
                let newUser = new User({
                    name: name,
                    email: email,
                    username:username,
                    password: bcrypt.hashSync(password, 10),
                    profileImage:`uploads/${profileImage}`
                })
                newUser.save()
                    .then((user) => {
                        console.log(user.username)
                        console.log(user.email)
                        console.log(user.password)
                    }).catch((e) => {
                        console.log(e)
                    })
            }
            req.flash('success', "You are now a registered and  can log in")
            res.location('/')
            res.redirect('/users/login')
        })


router.get('/logout', (req, res) =>{
    req.logout()
    req.flash('sucess', 'You are now logged out')
    res.redirect('/users/login')
})
module.exports = router