const handleRegisters = (req,res,bcrypt,saltRounds,db,knex) => {
        const {name, email, password} = req.body;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        
        if(!email || !password || !name){
            return res.json('Incorrect form submission').status(400)
        }


        db.transaction(trx =>{
            trx.insert({
                hash: hash,
                email:email
            })
            .into('login')
            .returning('email')
            .then(loginEmail=>{
                return trx('users').returning('*').insert({
                    email:loginEmail[0],
                    name:name,
                    joined: new Date()
                })
                .then(user=>{
                    console.log(user)
                    res.json(user[0])
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.json('Unable to register'))
    }

    module.exports = {
        handleRegisters : handleRegisters
    }