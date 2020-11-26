const handleSignin = (req,res,db,bcrypt,saltRounds) =>{

  const {email,password} = req.body
  
  if(!email || !password){
      return Promise.reject('Incorrect  form submission')
  }
  
 return db.select('hash', 'email').from('login')
  .where('email', '=',email)
  .then(data => {
      const isValid = bcrypt.compareSync(password,data[0].hash)
      if(isValid){
       return db.select('*').from('users')
       .where('email', '=', email)
       .then(user=> user[0])
       .catch(err=>{
           Promise.reject('Unable to get user')
       })
      }else{Promise.reject('Invalid credentials')}
  })
  .catch(err=> Promise.reject('Invalid credentials'))
  }

const getAuthToken = () => {
    console.log('auth ok');
}

const signinAuthentication = (db, bcrypt) = (req, res) => {
    const { authorization } = req.headers;
    return authorization ? getAuthTokenId() : handleSignin(req, res, db, bcrypt, saltRound).then(data => res.json(data))
    .catch(err => res.status(400).json(err))
  }
  
  module.exports = {
    signinAuthentication
  } 