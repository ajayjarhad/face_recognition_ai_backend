const Clarifai = require('clarifai')

const app = new Clarifai.App ({
   apiKey: process.env.API_CLARIFAI_KEY
})

const handleApiCalls = (req, res) =>{
    app.models.predict(
        'a403429f2ddf4b49b307e318f00e528b',
        req.body.input
      )
      .then(data => {
          res.json(data)
      })
}

const handleImage = (req,res,db) => {
const {id} = req.body
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
.then(entries=>{
     res.json(entries[0])
})
.catch(err=>{
    res.json('Error getting entries')
})
}

module.exports = {
    handleImage,
    handleApiCalls,
}