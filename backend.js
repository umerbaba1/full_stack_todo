const express=require('express')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET="ukruoahudhasudhaskuds"
const cookieParser = require('cookie-parser');

// initializing indtance
const app=express()

// middleware
app.use(cookieParser());
app.use(express.static(__dirname + '\\public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

// auth middleware
function auth(req,res,next){
    const token=req.cookies.token
    if(!token){
        res.status(402).json({msg:"User access denied"})
    }else{
        jwt.verify(token,JWT_SECRET,(err,decoded)=>{
            if(err){
                res.json({err})
            }else{
                req.username=decoded.username
                next()
            }
        })
    }
}


// In Memory Storage
let users=[]

// Signup Page
app.get('/',(req,res)=>{
    res.sendFile(__dirname+"\\public\\index.html")
})

// Signup server
app.post('/signup',(req,res)=>{
    const username=req.body.username
    const password=req.body.password
    console.log(username,password)
    if(!username & !password){
        res.status(422).json({
            msg:"Write username or password"
        }
        )
    }else {
        users.push({
            username:username,
            password:password
        })
        res.redirect('/signIN')
    }
})

// SignIn Page
app.get('/signIN',(req,res)=>{
    res.sendFile(__dirname + "\\public\\signin.html");
})

// Signin Sever
app.post('/signin', (req, res) => {
    const username=req.body.username
    const password=req.body.password

    const userFind=users.find(req=> req.username===username && req.password===password)
    if(!userFind){
        res.status(422).json({
            msg:"PLease Signup"
        })
    }else{
        const token=jwt.sign({
            username:username
        },JWT_SECRET,{expiresIn:"7days"})
        res.cookie('token', token, {
            httpOnly: true, // Prevents access via JavaScript
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
            maxAge: 604800000, // 1 hour
        });
        res.redirect('/todo')
    }
});

// Dashboard
app.get('/dashboard',auth,(req,res)=>{
    const username=req.username
    res.json({
        msg:username
    })
})

//Todo Page
app.get('/todo',auth,(req,res)=>{
    res.sendFile(__dirname + "\\public\\todo.html");
})


//Diplaying Username
app.post('/todo-user-info',auth,(req,res)=>{
    const username=req.username
    res.json({username:username})
})



app.listen(9000)