const express = require('express');
const app = express();
var async = require("async");
const upload = require('./ uplaod');
const mongoose = require('mongoose');
const path = require('path');
require('../config/dbconfig');
require('../Database/schema/users');
require('../Database/schema/admin');
require('../Database/schema/propertydata');
require('../Database/schema/file');
require('../Database/schema/contactus');
require('../Database/schema/photo');
require('../Database/schema/fbSchema');
const user = mongoose.model('Users');
const fbSchema = mongoose.model('FbSchema');
const admin = mongoose.model('Admin');
const propertySchemas = mongoose.model('propertySchema');
const Filesdata = mongoose.model('Filesdata');
const Contactus = mongoose.model('Contactus');
const Photo = mongoose.model('Photos');
const mongodb = require('mongodb');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var multer = require('multer');
var http = require('http');
//var fs = require('file-system');

var request = require('request');
//var sio = require('socket.io');
var storage = require('storage');

var base64 = require('base-64');
var session = require('express-session')

var sess;

const bcrypt = require('bcryptjs');
const saltRounds = 10;


var fs = require('fs');
const fetch =require('node-fetch');

module.exports.Home = (req, res) => {
    res.render('home');
}



//old login api

// module.exports.Login = (req, res) => {
//     console.log(req.body);//tells the angualr data  what is data
//     sess = req.session;
//     user.findOne({ email: req.body.email, password: req.body.password })
//         .then((result) => {
//             if (result != null) {
//                 console.log("Sam", result);
//                 req.session.result = result;
//                 res.send("login successful");
//             }
//             else {
//                 console.log(result);
//                 res.send("unsuccessful");
//             }
//         })
//         .catch((err) => {
//             console.log(err);
//             res.send("hello");
//         })
// }


//old login api end


module.exports.Login = (req, res) => {
    console.log(req.body);//tells the angualr data  what is data
    sess = req.session;
    user.find({ email: req.body.email})
        .then((result) => {
            console.log("result find",result[0].password);
            console.log(req.body.password);
            bcrypt.compare(req.body.password, result[0].password, (error, result) => {
                console.log("result find bcrypt",result,error);
                    if (result) {
                        console.log("Sam", result);
                        req.session.result = result;
                        res.send("login successful");
                    }
                    else {
                        console.log(result);
                        res.send("unsuccessful");
                    }
            })
        })
        .catch((err) => {
            console.log(err);
            res.send("hello");
        })
}
//logout api


module.exports.logout = (req, res) => {
    console.log(req.session);
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.send(err.message, res);
        }
        else {
            res.send('User logged out successfully!', res, {});
        }
    });
};


//logout api end

module.exports.Signup = (req, res) => {
    console.log(req.body);
    user.findOne({ email: req.body.email })
        .then((result) => {
            if (result != null) {
                console.log("Sam", result);
                res.send("user exist");
            }
            else {
                bcrypt.hash(req.body.pass, saltRounds, function(err, hash) 
               
                {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        async.series({
                            user: function (callback) {
                                const mydata = {
                                    user_name: req.body.name,
                                    email: req.body.email,
                                    password: hash,
                                    repeatpassword: hash,
                                    remember: req.body.remember,
                                }
                                console.log('this is my data', mydata);
                                new user(mydata).save().then(data => {
                                    res.send(data);
                                    console.log('succefull data');

                                    //mail varifie
                                    var transporter = nodemailer.createTransport({
                                        service: 'gmail',
                                        auth: {
                                            user: 'jssaurabh.gupta786@gmail.com',
                                            pass: 'Kumar@123'
                                        }
                                    });
                                    var maillist = [mydata.email, 'jssaurabh.gupta786@gmail.com'];
                                    var mailOptions = {
                                        from: 'jssaurabh.gupta786@gmail.com',
                                        to: maillist,
                                        subject: 'Sending Email using saurabhProperty',
                                        text: 'you are success fully signup! in' + mydata.email,

                                    };
                                    transporter.sendMail(mailOptions, function (error, info) {
                                        if (error) {
                                            console.log(error);
                                        }
                                        else {
                                            console.log('Email sent: ' + info.response);
                                        }
                                    });

                                    //mail varifie


                                })
                                    .catch((err) => {
                                        console.log(err);
                                        res.send("hello");
                                    })

                            }
                        })
                    }
                })
            }
        })
        .catch((err) => {
            console.log(err);
            res.send("hello");
        })

}



module.exports.Propertydetail = (req, res) => {
    async.series({
        propertySchemas: function (callback) {
            const mypropertydata = {
                propertyimage: req.body.propertyimage,
                propertyname: req.body.propertyname,
                propertyprice: req.body.propertyprice,
                phone: req.body.phone,
                propertydescreption: req.body.propertydescreption,
                propertystate: req.body.propertystate,
                propertycity: req.body.propertycity,
                propertystatus: req.body.propertystatus,
                propertyleaseperioud: req.body.propertyleaseperioud,
                propertyminbed: req.body.propertyminbed,
                propertyarea: req.body.propertyarea,
                propertySwimmingpool: req.body.propertySwimmingpool,
                propertyStories: req.body.propertyStories,
                propertyexit: req.body.propertyexit,
                propertyrireplace: req.body.propertyrireplace,
                propertylaundryroom: req.body.propertylaundryroom,
                propertyJogpath: req.body.propertyJogpath,
                propertyCeilings: req.body.propertyCeilings,
                propertyDualsink: req.body.propertyDualsink,
                imageSrc: req.body.imageSrc,
                propertyVideo1: req.body.propertyVideo1,
                propertyVideo2: req.body.propertyVideo2,
                propertyVideo3: req.body.propertyVideo3,
                checkBox: req.body.checkBox,
            }
            console.log('this is my data', mypropertydata);
            new propertySchemas(mypropertydata).save()
                .then(data => {
                    res.send(data);

                    console.log('succefull data');
                })
                .catch((err) => {
                    console.log(err);
                    res.send("hello");  //mail varifie
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'jssaurabh.gupta786@gmail.com',
                            pass: 'Kumar@123'
                        }
                    });
                    var maillist = [mydata.email, 'jssaurabh.gupta786@gmail.com'];
                    var mailOptions = {
                        from: 'jssaurabh.gupta786@gmail.com',
                        to: maillist,
                        subject: 'Sending Email using saurabhProperty',
                        text: 'you are success fully signup! in' + mydata.email,

                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    //mail varifie

                })

        }
    })
}

module.exports.FilesSubData = (req, res) => {
    console.log(req.body);
    async.series({
        Filesdata: function (callback) {
            const myfiledata = {
                fimage: req.body.fimage,
                fname: req.body.fname,
                fprice: req.body.fprice,
            }
            console.log('this is my data', myfiledata);
            new Filesdata(myfiledata).save()
                .then(data => {
                    res.send(data);
                    console.log('succefull data');
                })
                .catch((err) => {
                    console.log(err);
                    res.send("hello");
                })

        }
    })
}


exports.PropertyDataScroll = (req, res) => {
    try {
        Filesdata.find()
            .then((result) => {
                res.send(result);
                console.log("img data found", result);
            }
            );
    }
    catch (err) {
        throw err;
    }
}

exports.PropertyDataSchema = (req, res) => {
    try {
        propertySchemas.find()
            .then((result) => {
                res.send(result);
                console.log("propertydata api found", result);
            }
            );
    }
    catch (err) {
        throw err;
    }
}
exports.PropertyDataDelet = (req, res) => {
    try {
        propertySchemas.deleteOne({_id:req.body._id})
            .then((result) => {
                res.send("Done");
                console.log("property Data delete from DATABASE", result);
            }
            );
    }
    catch (err) {
        throw err;
    }
}

exports.PropertyData = (req, res) => {
    try {
        Filesdata.find()
            .then((result) => {
                res.send(result);
                console.log("kukjbdsh fhdfh hjgehj", result);
            }
            );
    }
    catch (err) {
        throw err;
    }
}

exports.SignupDataAdmin = (req, res) => {
    try {
        user.find()
            .then((result) => {
                res.send(result);
                console.log("Signup Data Found FOR Admin", result);
            }
            );
            
    }
    catch (err) {
        throw err;
    }
}
exports.SignupDataDelete = (req, res) => {
    console.log("response of delete function",req.body);
    try {
        user.deleteOne({email:req.body.email})
            .then((result) => {
                res.send("Done");
                console.log("Signup Data delete from DATABASE", result);
            }
            );
            
    }
    catch (err) {
        throw err;
    }
}
//forget password using link
module.exports.Forgetpassword = (req, res) => {
    console.log(req.body);
    user.findOne({ email: req.body.email })
        .then((result) => {
            if (result != null) {
                console.log("Sam", result);
                res.send("user exist");
                //mail varifie
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'jssaurabh.gupta786@gmail.com',
                        pass: 'Kumar@123'
                    }
                });
                var maillist = [result.email, 'jssaurabh.gupta786@gmail.com'];
                var mailOptions = {
                    from: 'jssaurabh.gupta786@gmail.com',
                    to:  maillist,
                    subject: 'Sending Email using Node.js',
                    text: 'you are success fully login!',
                    html: '<b>Hello world?</b><br><a href="http://127.0.0.1:8080/#!/Forgetpassword">My web</a>'
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('Email sent: ' + info.response);
                    }
                });

                //mail varifie
            }
            else {
                console.log("error result", result);
                res.send("user not exist");

            }
        })
        .catch((err) => {
            console.log(err);
            res.send("Result not found");
        })

}

//forget password using link end


module.exports.setNewPassword = (req, res) => {
    console.log(req.body);
    if (req.body && req.body.email && req.body.pass && req.body.repeatPass) {
        user.findOne({ email: req.body.email }).exec(function (err, email) {
            //last check if passwords are matching
            if (req.body.pass != req.body.repeatPass || err || !email) {
                if (req.body.pass != req.body.repeatPass) {
                    res.send("Passwords are not matching!");
                }
                else {
                    res.send("User not found");
                }
            }
            else {
                user.findOne({ email: req.body.email }).exec(function (err, email) {
                    if (err || !email) {
                        res.send("User not found");

                    }
                    else {
                        bcrypt.hash(req.body.pass, saltRounds, function(err, hash) 
               
                        {
                        user.updateOne({ email: req.body.email }, { $set: { password: hash, repeatpassword: hash,} }, function (err, email) {
                            console.log("id is", email);
                            res.send("login successful");
                        });
                    });
                    }
                })
            }
        })
    }
    else {
        return res.status(500).json({ message: "Not all required data is provided" })
    }
}
module.exports.Contactus = (req, res) => {
    console.log("contact data which is find", req.body);
    async.series({
        Contactus: function (callback) {
            const formData = {
                name: req.body.name,
                email: req.body.email,
                contact: req.body.contact,
                address: req.body.address,
                query: req.body.query

            }
            console.log("my contact form data", formData);
            new Contactus(formData).save()
                .then(data => {
                    res.send(data);
                    console.log("contact successfully");
                    //mail varifie
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'jssaurabh.gupta786@gmail.com',
                            pass: 'Kumar@123'
                        }
                    });
                    var maillist = [formData.email, 'jssaurabh.gupta786@gmail.com'];
                    var mailOptions = {
                        from: 'jssaurabh.gupta786@gmail.com',
                        to: maillist,
                        subject: 'Sending Email using saurabhProperty',
                        text: 'contact by ' + formData.email + " " + " " + formData.contact,

                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log('Email sent: ' + info.response);
                        }
                    });

                    //mail varifie end

                })
                .catch((err) => {
                    res.send(err);
                    console.log("err in save data");

                })
        }
    })

}
module.exports.FilesSubData = (req, res) => {
    console.log(req.body);
    async.series({
        Filesdata: function (callback) {
            const myfiledata = {
                fimage: req.body.fimage,
                fname: req.body.fname,
                fprice: req.body.fprice,
            }
            console.log('this is my data', myfiledata);
            new Filesdata(myfiledata).save()
                .then(data => {
                    res.send(data);
                    console.log('succefull data');
                })
                .catch((err) => {
                    console.log(err);
                    res.send("hello");
                })

        }
    })
}


// module.exports.fileget = (req, res, next) => {

//     Photo.find({}, ['path', 'caption'], { sort: { _id: -1 } }, function (err, result) {
//         //   res.render('home', 
//         //     { 
//         //     title: 'NodeJS file upload tutorial', 
//         //     msg:req.query.msg,
//         //     photolist : photos 
//         //     });
//         res.send(result);

//         console.log("img data found", result);
//     });
//     // console.log("file path",photolist);
// }



//require('events').EventEmitter.defaultMaxListeners = Infinity;

module.exports.fileget = (req, res, next) =>  {
    var ph;
    //model is a mongodb model object for the schema
    Photo.find({}, function(err, result) {
        console.log("dfhghdfbgdfh",result);
       
    //  result.forEach(function(pic) {
        
    //  ph = pic['path'];
    //  console.log("kl",ph);

    //  var array3 = new Array;
    //  array3.push(ph);

    //  console.log('aaaaaaaaaaaaaaa',array3);
  
   //
   
   console.log("klvs",result[0].path);
    res.sendFile(path.join(__dirname, '../public/'+result[0].path));
//    res.writeHead(200, {'Content-Type': 'image/jpeg'||'image/png'||'image/jpg'} );
//    //res.contentType('image/jpeg')
//     console.log("dhgfjkdghdfjkgh",ph);
//    res.end(ph, 'binary');

//  })
 });
}

// module.exports.fileget=(req, res, next)=>{
//     console.log("Get cake function");
//     Photo.find(function (err, doc) {
//         if (err) return next(err);
//         console.log("hell",doc[0]);
//     var base64 = (doc[0].path.toString('base64'));
//      res.send(base64);

//     });
// };



module.exports.uplaod = (req, res) => {
    console.log(req.body);
    upload(req, res, (err) => {
        if (err) {
            res.render('home', {
                msg: err
            });
        }
        else {
            if (req.file == undefined) {
                res.render('home', {
                    msg: 'Error: no file selected!'
                });
            }
            else {
                var fullPath = 'uploads/' + req.file.filename
                var document = {
                    path: fullPath,
                    caption: req.body.caption
                };
                var photo = new Photo(document);
                photo.save(function (error) {
                    if (error) {
                        throw error;
                    }
                    // else{
                    //     res.render('home',{
                    //     file:fullPath ,
                    // })
                    // }
                    res.redirect('/?msg=1');
                });

            }
        }
    });
};
// module.exports.LoginWithFacebook,async (req ,res)=>{
// // app.post('/login-with-facebook',async (req ,res)=>{
//     const{ accessToken ,userID,name } = req.body
// console.log("somthing data find",userID,accessToken,name)
//    const response=await fetch(`https://graph.facebook.com/v3.1/me?access_token=${accessToken}&method=get&pretty=0&sdk=joey&suppress_http_code=1`)
//    console.log("facebook pas",response)
//    const json =await response.json()
//    console.log("facebook name data find",json.name);
//    if(json.id === userID)
//    {
// console.log('json.')
//     const result = await fbSchema.findOne({facebookID : userID })
//         if(result){
//             console.log('all result find ',result);
//             res.json({status:'ok', data:'you are logged in'})
//         }
//         else{
//             const person= new fbSchema({
//                 name:json.name,
//                 facebookID:userID,
//                 accessToken
//             })
//             await person.save()
//             res.json({status:'ok', data: 'you are registerd'})
//         }
// }else{
//     //odifjsdoi
//     res.json({status:'ok', data: 'dont try to this'})
//    }
// };




 //require('../Database/schema/logout');

// module.exports.logoutUser=(req,res)=>{
//   logout.logoutUser((err, data)=> {
//     if (err) {
//       res.json({ 'error': data.error, 'message': data.message });
//     } else {
//       res.json({ 'success': data.success, 'message': data.message });
//     }
//   });
// };




// var logout = function(){};

// logout.prototype.logoutUser = function(req, res, callback){
//     var sess = req.session.user;
//     if(sess){
//         req.session.user = null;
//         return callback(null, {'success': true, "message": "user logout successfully"});
//     }
//     callback(null, {'success': true, "message": "user logout successfully"});
// }

// module.exports = new logout();


// router.post('/logout', function(req, res) {
//     logout.logoutUser(req, res, function(err, data) {
//       if (err) {
//         res.json({ 'error': data.error, 'message': data.message });
//       } else {
//         res.json({ 'success': data.success, 'message': data.message });
//       }
//     });
//   });

//   module.exports = router;




// //logout system
// module.exports.logoutUser = (req, res)=> {
//     //  if(req.user.facebook){
//     //     var user = {};
//     //     user.facebook = {};
//     //       User.findByIdAndUpdate(req.user._id, { $set: user }, { new: true }, function (err, userUpdated) {

//     //     });
//     //  }
//     req.logout();
//     res.status(200).json({message: 'Succesfully logged out'});
// }
// //end logout system





//passport facebook

// var FacebookStrategy = require('passport-facebook').Strategy;
// var session = require('express-session')

// module.exports= function(passport){


//   app.use(passport.initialize());
//   app.use(passport.session());
//   app.use(session({secret: 'keyboard cat',resave: false,saveUninitialized: true,cookie: { secure: false }
//   }))

//   passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function(id, done) {
//     user.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });

//     passport.use('facebook',new FacebookStrategy({
//         clientID: FACEBOOK_APP_ID,
//         clientSecret: FACEBOOK_APP_SECRET,
//         callbackURL: "http://localhost:4000/auth/facebook",
//         profileFields: ['id', 'displayName', 'photos', 'email']
//       },
//       function(accessToken, refreshToken, profile, done) {
//           console.log(profile);
//         // user.findOrCreate(..., function(err, user) {
//         //   if (err) { return done(err); }
//         //   done(null, user);
//         // });
//         done(null,profile);
//       }
//     ));


//     return passport;
// }

// //end facebook passport





