require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

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


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });


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
                if(foundUser.password === password) {
                    res.render('secrets');
                } else {
                    res.send('incorrect password')
                }
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
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save((err)=> {
        if(!err) {
            console.log('succussfully created new user');
            res.render('secrets')
        } else {console.log(err);}
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