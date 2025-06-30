const express = require("express");
const router = new express.Router();
const {upload } = require("../services/service");
const ProductModel=require("../models/brandProductModel");

router.post("/addProduct",upload().single("productImage"),async(req,res)=>{
      try{
        let body=req.body;
        let obj={...body,productImage:req.file.location};
        let product=new ProductModel(obj);
        let data=await product.save();
        res.json({status:true,msg:"Product added successfully"});
      }catch(err){
        res.status(400).send(err);
      }
});

router.patch("/updateProduct/:id",async(req,res)=>{
    try{
      let _id=req.params.id;
      let body=req.body;
      let product= await ProductModel.findByIdAndUpdate(_id,body);
      res.json({status:true,msg:"Product updated successfully"});
    }catch(err){
      res.status(500).send(err);
    }
});


router.patch("/updateProductImageBy/:id",upload().single("productImage"),async (req,res)=>{
  try{
      let _id=req.params.id;
      let body={productImage:req.file.location};
      let product=await ProductModel.findByIdAndUpdate(_id,body,{new:true});
      res.json({status:true,msg:"File Uploaded successfully"});
  }catch(err){
      res.status(500).send(err);
  }
});


router.get("/allProductsByBrand/:id",async(req,res)=>{ 
  try{
    let id=req.params.id;
    let products=await ProductModel.find({userId:id});
    res.send(products);
  }catch(err){
    res.status(400).send(err);
  }
});

router.get("/allProducts/:id",async(req,res)=>{
    try{
      let id=req.params.id;
      let products=await ProductModel.find({categoryId:id});
      res.send(products);
    }catch(err){
      res.status(400).send(err);
    }
});

router.get("/getAllProducts",async(req,res)=>{
  try{
    let products=await ProductModel.find({});
    res.send(products);
  }catch(err){
    res.status(400).send(err);
  }
});

router.delete("/deleteProduct/:id",async(req,res)=>{
    try{
      let _id=req.params.id;
      let product=await ProductModel.findByIdAndDelete(_id);
      res.json({status:true,msg:"Product deleted successfully"});
    }catch(err){
      res.status(500).send(err);
    }
});

module.exports=router;