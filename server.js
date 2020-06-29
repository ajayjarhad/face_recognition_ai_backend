const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors  = require('cors')
const app = express()
const knex =require('knex')

const register = require('./controllers/register')
const profile = require('./controllers/profile')
const signin = require('./controllers/signin')
const image = require('./controllers/image')


const saltRounds = 10;

app.use(bodyParser.json())
app.use(cors())

const db = knex({client: 'pg',
connection: {
  host : '127.0.0.1',
  user : 'postgres',
  password : 'pass',
  database : 'face_recognition'
}})

app.post('/signin',(req,res)=>{signin.handleSignin(req,res,db,bcrypt,saltRounds)})

app.post('/register',(req, res)=>{register.handleRegisters(req,res,bcrypt,saltRounds,db,knex)})

app.get('/profile/:id',(req, res)=>{profile.handleProfiles(req,res,db)})

app.put('/image',(req,res)=>{image.handleImage(req,res,db)})

app.post('/imageurl', (req, res)=>{image.handleApiCalls(req,res)})

app.listen(3434,()=>{
    console.log('Connected on port 3434.')
})

