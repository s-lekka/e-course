const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require("body-parser");
var counter = 0;
var users = [];


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors())

app.get('/', function(req,res) {
    console.log('GET /')
    res.status(200).send('Here Lies the Server')
})

app.get('/users', function(req, res){
    res.status(200).send(users)
})

app.get('/users/register', function(req, res){
    res.status(200).send('Register User Route')
})


app.post('/users/register', function(req, res){
    var formData = new Map(req.body);
    var user = new User(
        counter,
        formData.get("fname"),
        formData.get("lname"),
        formData.get("phone"),
        formData.get("adr"),
        formData.get("edulvl"),
        formData.get("email"),
        formData.get("pw")
    );

    if (!(userExists(user.email))) {
        users.push(user)
        res.sendStatus(201)
    }
    else {
        counter--;
        res.sendStatus(200)
    }

})

app.post('/users/validate', function(req, res) {
    var creds = req.body;
    var username = creds.username
    var password = creds.password
    
    console.log('looking for '+username)
    if (userExists(username)) {
        var userid = findUser(username)

        console.log('found user')
        if (users[userid].pw === password) {
            console.log('correct password')
            console.log('responding with user id='+userid)
            var response = {
                'userid':userid
            }
            res.status(200).end(JSON.stringify(response))
        }
        else {
            console.log('wrong password')
            res.sendStatus(400)
        } 
    }
    else {
        console.log('wrong credentials')
        res.sendStatus(400)
    }
    res.end()
})

app.get('/users/profile/:userid', function(req, res){
    var id = req.params['userid']
    console.log('sending user info with id '+id)
    res.setHeader('Content-Type', 'application/json').status(200).json(users[id])
})


app.listen(8080)

class User {
    constructor(id, first, last, tel, adr, edu, email, pw) {
        this.id = id;
        this.fname = first;
        this.lname = last;
        this.phone = tel;
        this.adr = adr;
        this.edulvl = edu;
        this.email = email;
        this.pw = pw;

        counter++;
    }
}

function userExists(mail) {
    for (var i=0; i<users.length; i++) {
        if (users[i].email === mail) {
            return true
        }
    }
    return false
}


function findUser(mail) {
    for (var i=0; i<users.length; i++) {
        if (users[i].email === mail) {
            return i
        }
    }
    return 0
}

