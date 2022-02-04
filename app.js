require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const productRoute=require('./routes/route');
const authRoute=require('./routes/authRoutes');
const cartRoutes=require('./routes/cartRoutes');
const PORT=process.env.PORT || 3000;
var methodOverride = require('method-override')
const seedDB=require('./seed.js');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
// seedDB();
const DB=process.env.DB;
mongoose.connect(DB).then(()=>console.log('db connected'));

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended:true}));
app.use(express.json({ extended:true}));
app.use(methodOverride('_method'));
app.use(session({ 
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
})
app.get('/',(req,res)=>{
    res.render('home');
})
app.get('/error',(req,res)=>{
    res.render('error');
})
app.use(productRoute);
app.use(authRoute);
app.use(cartRoutes);


app.listen(PORT,()=>{
    console.log("server running on port 3000");
});
