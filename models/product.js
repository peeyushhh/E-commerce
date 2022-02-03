const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    price:{
        type:Number,
        min:0,
    },
    img:{
        type:Object,
        trim:true,
        default:'/images/product.jpg'
    },
    desc:{ 
        type:String,
        trim:true,
        required:true,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Review'
        }
            ]
});

const Product=new mongoose.model('Product',productSchema);
module.exports=Product;