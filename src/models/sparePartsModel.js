const moongoose=require("mongoose");

const sparePartSchema= new moongoose.Schema({
    userId:{type:String,required:true},
    productId:{type:String,required:true},
    skuNo:{type:String,required:true},
    length:{type:Number,required:true},
    breadth:{type:Number,required:true},
    height:{type:Number,required:true},
    weight:{type:Number,required:true},
    brandName:{type:String},
    seller:{type:String},
    MRP:{type:Number,required:true},
    bestPrice:{type:Number,required:true},
    description:{type:String,required:true},
    partName:{type:String,required:true},
    category:{type:String,required:true},
    productModel:{type:String,required:true},
    partNo:{type:String,required:true},
    faultType:{type:Array},
    technician:{type:Number},
    images:{type:Array,required:true},
},{timestamps:true});

const sparePartModel=new moongoose.model("sparePart",sparePartSchema);

module.exports=sparePartModel;