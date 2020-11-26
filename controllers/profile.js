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

const handleProfileUpdate = (req, res, db) => {
    const { id } = req.params;
    const { name, age, pet } = req.body.formInput;
    db('users')
        .where({ id })
        .update({ name })
        .then(resp => {
            if (resp) {
            res.json("Success")
            }
            else {
                res.status(400).json('Unable to update')
            }
        })
    .catch(err=> res.status(400).json('Error updating user'))
}
module.exports = {
    handleProfiles: handleProfiles,
    handleProfileUpdate : handleProfileUpdate
} 