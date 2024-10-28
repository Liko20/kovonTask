const express = require('express')
const app = express();
const bodyparser = require('body-parser')
const mongoose = require('mongoose')
const usermodel = require('./schema')
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.use(cors())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))


app.get('/' , (req,res)=>{
    res.send("hello");
})

app.post('/login' , async(req,res)=>{
    
    const {email , password} = req.body

    const checkemail = await usermodel.findOne({ email : email})

    console.log(checkemail)

    if(checkemail){

        if(password === checkemail.password){

            token = jwt.sign({email:email}, "seceret");

            res.send({token:token,message:`welcome user ${email}`});
        }
        else{
            return res.sendStatus(403)
        }

    }else{
       return res.sendStatus(403)
    }

})

app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await usermodel.findOne({ email: email });
    if (user) return res.send("user already exists");
    else {
        try {
            newuser = new usermodel({
                email: email,
                password: password
            })
            token = await jwt.sign({ email: email },"secret");
            await newuser.save();
            return res.json({
                token:token
            })

        }catch{
            res.send("internal server error");
        }
        

    }

})

app.listen(5000 , (err)=>{
    if(err)console.log("error" ,err);
    console.log("port 5000")
})

mongoose.connect("mongodb://localhost:27017/kovon").then(()=>{
    console.log("connected to db");
}).catch((err)=>{
    console.log("error",err);
})



