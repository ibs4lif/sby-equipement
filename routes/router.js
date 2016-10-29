var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var Grid = require('gridfs-stream');
var fs = require('fs');
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
var ean = require('../models/ean.js');
var recuperation = require('../models/recuperation.js');

router.use(bodyParser.json());
router.use(cors());
router.use(cookieParser()); //**NEW**

var imagePath = path.join(__dirname, '../img/test.pdf');

var db = 'mongodb://ibrahima:sarr@ds011168.mlab.com:11168/ballot';
mongoose.connect(db);
var conn = mongoose.connection;

Grid.mongo = mongoose.mongo;
//==========================================
// Apprendre GridFs
//https://www.youtube.com/watch?v=EVIGIcm7o2w

// conn.once('open',function(){
//     console.log('- connection open -');
//     var gfs = Grid(conn.db);

//     var writestream = gfs.createWriteStream({
//         filename:'test.pdf'
//     });

//     fs.createReadStream(imagePath).pipe(writestream);

//     writestream.on('close',function(file){
//         console.log(file.filename + ' Written to DB');
//     });
// });

conn.once('open',function(){
    console.log('- connection open -');
    var gfs = Grid(conn.db);

    var fs_write_stream = fs.createWriteStream(path.join(__dirname, '../test/test.pdf'));

     var readstream = gfs.createReadStream({
         filename:'test.pdf'
     });

    readstream.pipe(fs_write_stream);

    fs_write_stream.on('close',function(file){
        console.log('File has been written fully');
    });
});



//------------------------------------------------------------------
//AUTHENTIFICATION
//------------------------------------------------------------------
// required for passport
router.use(session({ secret: 'ibrahimasarr' })); //session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash()); // use connect-flash for flash messages stored in session


require('../config/passport')(passport); // load our routes and pass in our app and fully configured passport


router.options('/facture', cors()); // enable pre-flight request for login request
router.options('/login', cors()); // enable pre-flight request for login request
router.options('/signup', cors()); // enable pre-flight request for signup request

    // process the login form
    router.post('/login', cors(),passport.authenticate('local-login', {
        successRedirect: '/facture', // redirect to the secure profile section
        failureRedirect: '/error', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

router.get('/login:id', function (req, res) {
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
router.get('/facture',cors(), function (req, res) {

    facture.find({}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.get('/ean:id',cors(), function (req, res) {
    var id = req.params.id;

    ean.find({EAN: new RegExp(id, "i")},{'_id':false}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.get('/recuperation',cors(), function (req, res) {

    recuperation.find({},{'articles':false}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.get('/openrecuperation',cors(), function (req, res) {

    recuperation.find({open:true},{'articles':false}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.get('/recuperarion:id',cors(), function (req, res) {
    var id = req.params.id;

    ean.find({EAN: new RegExp(id, "i")},{'_id':false}).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});



router.get('/facturemagasin:id', function (req, res) {
    var id = req.params.id;
    facture.find({'magasin':id},{'_id':false}).sort({'reference': -1 }).exec(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});
router.get('/facturecamionneur:id', function (req, res) {
    var id = req.params.id;
    facture.find({'camionneur':id},{'_id':false}).sort({'reference': -1 }).exec(function(err,docs){
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

    newFacture.camionneur = req.body.camionneur;
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

router.post('/recuperation/',function(req,res){
    newRecuperation = recuperation();

    newRecuperation.name = req.body.name;
    newRecuperation.magasin = req.body.magasin;
    newRecuperation.open = req.body.open;
    newRecuperation.articles = req.body.articles;


    newRecuperation.save(function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.put('/recuperation/',function(req,res){
    // newRecuperation = recuperation();


    recuperation.findByIdAndUpdate(req.body.id,
        {$push:{'articles':
                {   EAN:req.body.EAN,
                    SAP:req.body.SAP, 
                    FRANCAIS:req.body.FRANCAIS,
                    ENGLISH:req.body.ENGLISH,
                    quantity:req.body.quantity
                } }},
        {safe: true, upsert: true,new : true},function(err,docs){
        if (err) {
            res.send('Une erreur s\'est produite');
        }else{
            res.json(docs);
            console.log(docs);
        }
    });

});

router.put('/recuperation/articleexist',function(req,res){
    // newRecuperation = recuperation();


    recuperation.findByIdAndUpdate(req.body.id,
        {$push:{'articles':
                {   EAN:req.body.EAN,
                    SAP:req.body.SAP, 
                    FRANCAIS:req.body.FRANCAIS,
                    ENGLISH:req.body.ENGLISH,
                    quantity:req.body.quantity
                } }},
        {safe: true, upsert: true,new : true},function(err,docs){
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
