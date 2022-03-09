const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt-nodejs');
const app = express();
const cors = require("cors");
const knex = require("knex");

const db= knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1', //localhost
      user : 'postgres', //add your user name for the database here
    //   port: 5432, // add your port number here
      password : 'pkdr2022.', //add your correct password in here
      database : 'smart-brain' //add your database name you created here
    }

});

// db.select('*').from('users')
// .then(data => {
//     console.log(data);

// })
app.use(bodyParser.json());
app.use(cors());


const database ={
    users: [
        {
            id:'1',
            name: 'dj',
            email: 'dj@gmail.com',
            password:'dj123',
            entries:0,
            joined: new Date()
        },
        {
            id:'2',
            name: 'pm',
            email: 'pm@gmail.com',
            password:'pm123',
            entries:0,
            joined: new Date()
        }
    ],
    login: [
        {
            id:'5',
            hash: '',
            email: 'j@gmail.com'
        }
    ]
}


app.get('/',(req,res)=>{
    res.send("database.users");
})

app.post('/signin',(req,res)=>{

    db.select('email','hash').from('login')
        .where('email','=',req.body.email)
        .then(data=>{
            const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
            console.log(data)
            if(isValid)
            {
                return db.select('*')
                    .from('users')
                    .where('email','=',req.body.email)
                    .then(user=>{
                        res.json(user[0])
                })
                .catch(err=> res.status(400).json("unable to get user"))
            }
            else{
                res.status(400).json("wrong credentials")
            }
        })
        .catch(err=> res.status(400).json("wrong credentials"))
})

app.post('/register',(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password)
    {
        return res.status(400).json("empty field");
    }
    
    else
    {
        const hash = bcrypt.hashSync(password);
        // Store hash in your password DB.
        db.transaction(trx=>{
            trx.insert({
                hash:hash,
                email:email
            })
            .into('login')
            .returning('email')
            .then(loginEmail=>{
                return trx('users')
                .returning('*')
                .insert({
                    name: name,
                    email: loginEmail[0].email,
                    joined: new Date()
                })
                .then(user =>{
                    res.json(user[0]);
                })
                
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('unable to register'))

    }
})



app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;

    db('users').where('id',id)
    .then(user=>{
        if(user.length){
            res.json(user[0])
        }
        else
        {
            res.status(400).json("not found")
        }
    })
    .catch(err => res.status(400).json("error getting user"))

})


app.put('/image',(req,res)=>{
    const {id} = req.body;
    db('users').where('id',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries) 
    })
    .catch(err => res.status(400).json("error getting user"))
    
})





// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(process.env.PORT ||3001,()=>{
    console.log('app is running');
})