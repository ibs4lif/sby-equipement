var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
//--------------------------
//**NEW**
var passport =require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
//---------------------------
var bodyParser = require('body-parser');
var cors = require('cors');


//---------------------------
//NOUVEAU
//---------------------------
    //models/user
    //config/ et tous les fichiers

//---------------------------
//NOUVEAU
//---------------------------

var facture = require('../models/facture.js');
var user = require('../models/user.js');

router.use(bodyParser.json());
router.use(cors());
router.use(cookieParser()); //**NEW**

var db = 'mongodb://ibrahima:sarr@ds011168.mlab.com:11168/ballot';
mongoose.connect(db);

//------------------------------------------------------------------
//AUTHENTIFICATION
//------------------------------------------------------------------
// required for passport
router.use(session({ secret: 'ibrahimasarr' })); //session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session


require('../config/passport')(passport); // load our routes and pass in our app and fully configured passport

    // process the login form
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/error', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/', // redirect to the secure profile section
        failureRedirect: '/', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // router.get('/profile', isLoggedIn, function (req, res) {
    //     res.render('profile.ejs', {
    //         user: req.user // get the user out of session and pass to template
    //     });
    // }); 

    // route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()){
        return next();
    }

    // if they aren't redirect them to the home page
    res.redirect('/signup');
}
//------------------------------------------------------------------
//AUTHENTIFICATION                        **************************
//------------------------------------------------------------------

//------------------------------------------------------------------
//BALOT
//------------------------------------------------------------------
router.get('/facture', function (req, res) {

    facture.find({}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.get('/facture:id', function (req, res) {
    var id = req.params.id;
    facture.find({'magasin':id}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.get('/profile:id', function (req, res) {
    var id = req.params.id;
    user.find({'local.email':id}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.post('/facture/',function(req,res){
    newFacture = facture();
    
    newFacture.magasin = req.body.magasin;
    newFacture.remorque = req.body.remorque;
    newFacture.route = req.body.route;
    newFacture.porte = req.body.porte;
    newFacture.reference = req.body.reference;
    newFacture.items = req.body.items;
    newFacture.date = req.body.date;

    newFacture.save(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);            
        }
    });

});



//------------------------------------------------------------------
//BALOT FIN
//------------------------------------------------------------------

module.exports = router;












