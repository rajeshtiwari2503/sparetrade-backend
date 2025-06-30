const mongoose=require("mongoose")

const sparePartFaultScheama=new mongoose.Schema({
    userId:{type:String,required:true},
    faultName:{type:String,required:true},
    productModel:{type:String,required:true},
    productId:{type:String,required:true},
    status:{type:String,default:"INACTIVE"},
    },{timestamps:true},
)

const SparePartFaultModel=new mongoose.model("SparePartFault",sparePartFaultScheama);

module.exports=SparePartFaultModel;