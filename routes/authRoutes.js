const express=require('express');
const route=express.Router();
const User = require('../models/user');
const passport = require('passport');

route.get('/register',(req,res)=>{
    res.render('auth/signup');
});
route.post('/register',async (req,res)=>{
    try{
     const {username,email,password,isAdmin} = req.body;
     const user=new User({
         username,email,isAdmin
     });
     await User.register(user,password);
     req.flash('success',`Welcome ${username},Please Login to Continue!`);
     res.redirect('/login');
    }
    catch(e)
    {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});
route.get('/login', (req, res) => {
    res.render('auth/login');
});
route.post('/login',
        passport.authenticate('local',{
            failureRedirect:'/login',
            failureFlash:true,
        }),
        (req,res)=>{
            try{
                const {username}=req.body;
                req.flash('success',`Welcome back again,${username}`);
                res.redirect('/products');
            }
            catch(e)
    {
        req.flash('error', e.message);
        res.redirect('/login');
    }
    
            
        }
);
route.get('/logout', (req, res) => {
    
    req.logout();

    req.flash('success', 'Logout out Successfully!!!');
    res.redirect('/login');
})

module.exports=route;