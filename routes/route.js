const express = require('express');
const route=new express.Router();
const {isLoggedIn}=require('../middleware/middleware');
const Product=require('../models/product');
const Review=require('../models/review');
route.get('/products',async(req, res) => {
    const products=await Product.find({}).sort({price:1});
    res.render('products/index',{products});
});
route.get('/products/new',isLoggedIn,(req, res) => {
res.render('products/new');
});
route.post('/products',isLoggedIn,async(req, res) => {
  try{
    const newProduct = {...req.body};
    await Product.create(newProduct);
    req.flash('success','Product Created Successfully!');
    res.redirect('/products');
  }
  catch(e)
  {
    req.flash('error', e.message);
    res.redirect('/error');
  }
   
});
route.patch('/products/:id',isLoggedIn,async(req, res)=>{
  try{
    const {id}=req.params;
    const data={...req.body};
    console.log(data);
   await Product.findByIdAndUpdate(id,data,{new:true});
   console.log("data updated");
   req.flash('success',"detail updated Successfully!");
   res.redirect(`/products/${id}`);
  }
  catch(e)
  {
    req.flash('error', e.message);
    res.redirect('/error');
  }

})
route.delete('/products/:id',isLoggedIn,async(req, res)=>{
  try{
    const {id}=req.params;
 await Product.findByIdAndDelete(id,{new:true});
 console.log("data deleted");
 req.flash('success','Product deleted Successfully');
 res.redirect(`/products`);
  }
  catch(e)
  {
    req.flash('error', e.message);
    res.redirect('/error');
  }
})
route.get('/products/:id',async (req, res) => {
  try{
    const {id}=req.params;
    const product=await Product.findById(id).populate('reviews'); //populate("array name in which ref is present"); in this review model item will be prent in product.review because of refrence
    res.render('products/details',{product});
  }
  catch(e)
  {
    req.flash('error', e.message);
    res.redirect('/error');
  }
  
});
route.get('/products/:id/edit',isLoggedIn,async(req, res) => {
  try{
    const {id}=req.params;
    const data=await Product.findById(id);
    res.render('products/editData',{data});
  }
  catch(e)
  {
    req.flash('error', e.message);
    res.redirect('/error');
  }
 
})
route.post('/products/:id/reviews',isLoggedIn,async(req, res) => {
  try{
    const  {id}= req.params;
    const review={...req.body,user:req.user.username};
    const newReview=new Review(review);
    const product = await Product.findById(id);
    product.reviews.push(newReview);
    await newReview.save();
    await product.save();
    req.flash('success','Created review successfully!');
  res.redirect(`/products/${id}`);
  console.log("data saved succefully");
  }
  catch(e)
  {
    req.flash('error', e.message);
    res.redirect('/error');
  }
});
route.delete("/products/:id/:reviewId/delete",isLoggedIn,async(req, res)=>{
  try{
    const {id,reviewId} = req.params;
    await Product.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId,{new:true});
    // product.reviews=product.reviews.filter((val)=>val._id!=reviewId);
    // await Product.findByIdAndUpdate(id,{reviews:product.reviews});
    // console.log(product.reviews);
    // console.log(reviewId);
    req.flash('success',"review deleted successfully!");
    res.redirect(`/products/${id}`);
  }
  catch(e)
  {
    req.flash('error', e.message);
    res.redirect('/error');
  }
})
module.exports =route;