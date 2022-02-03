const express=require('express');
const route=express.Router();
const Product = require('../models/product');
const User = require('../models/user');
const {isLoggedIn}=require('../middleware/middleware');
const Razorpay=require('razorpay');
const razorpay = new Razorpay({
    key_id: process.env.ID,
    key_secret: process.env.KEY,
  });

route.get('/user/cart',isLoggedIn,async (req,res)=>{
    const {_id}=req.user;
    const user=await User.findById(_id).populate('cart');
    res.render('cart/cart',{user});
});
route.post('/cart/:id/add',isLoggedIn,async(req,res)=>{
    try{
        const {id} = req.params;
        const product=await Product.findById(id);
        const currentUser = req.user;
        currentUser.cart.push(product);
        await currentUser.save();
        req.flash("success", `Success added ${product.name} in your cart`);
        res.redirect(`/user/cart`);
    }
    catch(e)
    {
        req.flash("error", e.message);
        res.redirect('/error');
    }
    

})
route.delete('/user/:id/remove',isLoggedIn,async(req,res)=>{
   try{
    const {id} = req.params;
    await User.findByIdAndUpdate(req.user._id,{$pull:{cart:id}});
    req.flash('success',"product removed successfully");
    res.redirect('/user/cart');
   }
   catch(e){
       req.flash('error',e.message);
       res.redirect('/user/cart');
   }
    
})
route.post('/payment',isLoggedIn,(req,res)=>{

    try{
        var options = {
            amount:"",  // amount in the smallest currency unit
            currency: "INR",
          };
          razorpay.orders.create(options, function(err, order) {
            console.log(order);
            res.json(order);
          });
    }
    catch(e) {
        req.flash('error',e.message);
        res.redirect('/user/cart');
    }

})
route.post('/is-order-complete',(req,res)=>{
    req.flash('success',"payment success!");
    res.redirect('/products');
})

module.exports=route;