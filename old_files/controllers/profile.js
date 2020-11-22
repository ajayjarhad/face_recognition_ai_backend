const handleProfiles = (req,res,db) =>
{
const {id} = req.params
db.select('*').from('users').where({id})
.then(user => {
    if(user.length){
        res.json(user[0])
    }
    else{
        res.json('Not found').status(400)
    }
}).catch(err=>{
    res.json('Error getting the data').status(400)
})
}

module.exports = {
    handleProfiles:handleProfiles
}