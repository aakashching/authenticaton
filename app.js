require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));


mongoose.connect('mongodb://localhost/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected to Database !")
});


const userSchema = mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model('User', userSchema);

app.get('/', (req,res)=> {
    res.render('home')
})
app.get('/login', (req,res)=> {
    res.render('login')
})
app.post('/login', (req,res)=> {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, (err, foundUser)=> {
        if(err) {
            console.log(err);
        } else {
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    // result == true
                    if(result == true) {
                        res.render('secrets')
                    }
                });
            } else {
                res.send('user not found')
            }
        }
    })
})

app.get('/register', (req,res)=> {
    res.render('register')
})
app.post ('/register', (req,res)=> {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.

        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err)=> {
            if(!err) {
                console.log('succussfully created new user');
                res.render('secrets')
            } else {console.log(err)}
        });
    });
    
})

app.get('/submit', (req,res)=> {
    res.render('submit')
})
app.get('/secrets', (req,res)=> {
    res.render('secrets')
})


app.listen(3000, ()=> {
    console.log('Server is Started!');
});