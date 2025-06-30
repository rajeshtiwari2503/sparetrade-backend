const mongoose=require("mongoose");

const checkoutSchema= new mongoose.Schema({
    userId:{type:String,required:true},
    brandId:{type:String,required:true},
    sparePartId:{type:String,required:true},
    sparePartName:{type:String,required:true},
    sparePartImage:{type:String,required:true},
    MRP:{type:String,required:true},
    sparePartCategory:{type:String,required:true},
    sparePartModel:{type:String,required:true},
    userName:{type:String,required:true},
    email:{type:String,required:true},
    address:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    pin:{type:String,required:true},
    contactNo:{type:String,required:true},

},{timestamps:true});

const CheckoutModel = new mongoose.model("AddToCart",checkoutSchema);

module.exports=CheckoutModel; 