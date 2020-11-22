const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const cors  = require('cors')
const app = express()
const knex =require('knex')
const morgan = require('morgan')

const register = require('./controllers/register')
const profile = require('./controllers/profile')
const signin = require('./controllers/signin')
const image = require('./controllers/image')


const saltRounds = 10;
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

// const db = knex({client: 'pg',
// connection: {
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// }})


const db = knex({
  client: 'pg',
  conntection: {
    host: '127.0.0.1',
    user: "postgres",
    password: "toor",
    database: 'smart-brain'
  }
  })


console.log('Das')
app.get('/',(req,res)=>{res.send('Everything is up')})

app.post('/signin',(req,res)=>{signin.handleSignin(req,res,db,bcrypt,saltRounds)})

app.post('/register',(req, res)=>{register.handleRegisters(req,res,bcrypt,saltRounds,db,knex)})

app.get('/profile/:id',(req, res)=>{profile.handleProfiles(req,res,db)})

app.put('/image',(req,res)=>{image.handleImage(req,res,db)})

app.post('/imageurl', (req, res)=>{image.handleApiCalls(req,res)})

app.listen(process.env.PORT || 3000,()=>{
  console.log(`Connected on port 3000.`)  //${process.env.PORT}
})
