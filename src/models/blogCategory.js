const mongoose=require("mongoose");

const blogCategorySchema=new mongoose.Schema({
 
      category:{type:String,required:true},
    
},{timestamps:true});

const blogCategoryModel=new mongoose.model("blogCategory",blogCategorySchema);

module.exports=blogCategoryModel;