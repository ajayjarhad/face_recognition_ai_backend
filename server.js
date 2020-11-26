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
  host : process.env.POSTGRES_HOST,
  user : process.env.POSTGRES_USER,
  password : process.env.POSTGRES_PASSWORD,
  database : process.env.POSTGRES_DB
}})
app.get('/',(req,res)=>{res.send('Everything is up')})
app.post('/signin',(req,res)=>{signin.handleSigninAuthentication(req,res,db,bcrypt,saltRounds)})

app.post('/register',(req, res)=>{register.handleRegisters(req,res,bcrypt,saltRounds,db,knex)})

app.get('/profile/:id',(req, res)=>{profile.handleProfiles(req,res,db)})
app.post('/profile/:id', (req, res) => { profile.handleProfileUpdate(req, res, db) })

app.put('/image',(req,res)=>{image.handleImage(req,res,db)})

app.post('/imageurl', (req, res)=>{image.handleApiCalls(req,res)})

app.listen(3552,()=>{
    console.log('Connected on port 3552.')
})