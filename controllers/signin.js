// var jwt = require('jsonwebtoken');
// const redis = require('redis')
// var token = jwt.sign({ foo: 'bar' }, 'shhhhh');

// const redisClient = redis.createClient(process.env.REDIS_URI);

// const handleSignin = (req, res, db, bcrypt,) => {

//   const {email,password} = req.body
  
//   if(!email || !password){
//       return Promise.reject('Incorrect  form submission')
//   }
  
//  return db.select('hash', 'email').from('login')
//   .where('email', '=',email)
//   .then(data => {
//       const isValid = bcrypt.compareSync(password,data[0].hash)
//       if(isValid){
//        return db.select('*').from('users')
//        .where('email', '=', email)
//        .then(user=> user[0])
//        .catch(err=>{
//            Promise.reject('Unable to get user')
//        })
//       }else{Promise.reject('Invalid credentials')}
//   })
//   .catch(err=> Promise.reject('Invalid credentials'))
//   }
  


// const getAuthToken = (red,res) => {
//   const { authorization } = req.headers;
//   return redisClient.get(authorization, (err, reply) => {
//     if (err || !reply) {
//       return res.status(400).json('unauthorized')
//     }
//     return res.json ({id:reply})
//   })
// }

// const setToken = (key, value) => {
//  return  Promise.resolve(redisClient.set(key,value))
// }

// const createSessions = (user) => {
//   const { email, id } = user;
//   const token = signToken(email);
//   return setTokem(token,id)
//     .then(() => {
//       return {success: 'true', userId : id, token}
//     })
//   .catch(console.log)
//   return { success: 'true', userId: id, token }
// }

// const signToken = (email) => {
//   const jwtPayload = { email };
//   return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'})
// }


// const signinAuthentication = (db, bcrypt) => (req, res) => {
//     const { authorization } = req.headers;
//   return authorization ? getAuthTokenId(req, res) : handleSignin(req, res, db, bcrypt).then(data => { return data.id && data.email ? createSessions(data) : Promise.reject(data) })
//       .then(session => res.json(session))
//     .catch(err => res.status(400).json(err))
//   }
  
//   module.exports = {
//     signinAuthentication:signinAuthentication
//   } 



const jwt = require('jsonwebtoken');

// Redis Setup
const redis = require('redis');

// You will want to update your host to the proper address in production
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (username) => {
  const jwtPayload = { username };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', { expiresIn: '2 days'});
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token, user }
    })
    .catch(console.log);
};

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        return Promise.reject('wrong credentials');
      }
    })
    .catch(err => err)
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).send('Unauthorized');
    }
    return res.json({id: reply})
  });
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
    .then(data =>
      data.id && data.email ? createSession(data) : Promise.reject(data))
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err));
}

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
}