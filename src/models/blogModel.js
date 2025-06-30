const mongoose=require("mongoose");

const blogSchema=new mongoose.Schema({
      image:{type:String,required:true},
      title:{type:String,required:true},
      content:{type:String,required:true},
      shortDescription:{type:String,required:true},
      category:{type:String,required:true},
      metaTitle:{type:String},
      metaImage:{type:String},
      metaDescription:{type:String},
      slug:{type:String},
      metaKeyword:{type:String},

},{timestamps:true});

const blogModel=new mongoose.model("blog",blogSchema);

module.exports=blogModel;