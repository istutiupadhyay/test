const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const sgMail = require('@sendgrid/mail');

 const signup = (req, res)=>{
    const { name, email, mobile, password } = req.body;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(err){
                console.log('Unable to create new user')
                res.json({message: 'Unable to create new user'})
            }
            User.create({ name, email, mobile, password: hash }).then(() => {
                res.status(201).json({message: 'Successfuly create new user'})
            }).catch(err => {
                res.status(403).json(err);
            })

        });
    });
}

function generateAccessToken(id) {
    return jwt.sign(id ,process.env.TOKEN_SECRET);
}

const login = (req, res) => {
    const { email, password } = req.body;
    console.log(password);
    User.findAll({ where : { email }}).then(user => {
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, function(err, response) {
                if (err){
                console.log(err)
                return res.json({success: false, message: 'Something went wrong'})
                }
                if (response){
                    console.log(JSON.stringify(user))
                    const jwttoken = generateAccessToken(user[0].id);
                    res.json({token: jwttoken, success: true, message: 'Successfully Logged In'})
                // Send JWT
                } else {
                // response is OutgoingMessage object that server response http request
                return res.status(401).json({success: false, message: 'passwords do not match'});
                }
            });
        } else {
            return res.status(404).json({success: false, message: 'passwords do not match'})
        }
    })
}
const mail = async (req, res) => {
    try {
        const { email } =  req.body;
            sgMail.setApiKey(process.env.SENGRID_API_KEY)

            const msg = {
                to: email, // Change to your recipient
                from: 'upadhyayistuti@gmail.com', // Change to your verified sender
                subject: 'Sending with SendGrid is Fun',
                text: 'You are registered successfully!!',
            }

            sgMail
            .send(msg)
            .then((response) => {
                return res.status(response[0].statusCode).json({message: 'check your mail for confirmation ', sucess: true})

            })
            .catch((error) => {
                throw new Error(error);
            })

        } catch(err){
        console.error(err)
        return res.json({ message: err, sucess: false });
    }

}
module.exports = {
    signup,
    login,
    mail
}



