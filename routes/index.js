const express = require('express')
const router = express.Router()
// const User = require('../models/User')


/*GET home page. */

router.get('/', (req, res) => {
    res.render('index', {title:'Members'})   
    console.log("hello")
})

// , ensureAuthenticated,

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    } else {
        res.redirect('/users/login')
    }
}

module.exports = router
