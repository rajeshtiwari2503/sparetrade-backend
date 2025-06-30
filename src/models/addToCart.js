const mongoose=require("mongoose");

const addToCartSchema= new mongoose.Schema({
    userId:{type:String,required:true},
    brandId:{type:String,required:true},
    sparePartId:{type:String,required:true},
    sparePartName:{type:String,required:true},
    sparePartImage:{type:String,required:true},
    MRP:{type:String,required:true},
    technician:{type:Boolean},
    sparePartCategory:{type:String,required:true},
    sparePartModel:{type:String,required:true},
    quantity:{type:String,required:true}
},{timestamps:true});

const AddToCartModel = new mongoose.model("AddToCart",addToCartSchema);

module.exports=AddToCartModel;   