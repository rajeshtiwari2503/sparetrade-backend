const express = require("express");
const router = new express.Router();
const {upload } = require("../services/service");
const multer=require("multer");
const BrandCategoryModel = require("../models/brandProductCategories");
 

router.post("/addProductCategory",upload().single("categoryImage"),async (req, res) => {
    let body = req.body;
    try {
        let check = await BrandCategoryModel.findOne({categoryName:{$regex: new RegExp('^'+body.categoryName.trim()+'$','i')}});
        let bool=false;
        if (check) {
            res.json({ status: false, msg: "Category already exists" });
        } else {
            let obj = { ...body,categoryImage:req.file.location };
            let category = new  BrandCategoryModel(obj);
            let newcategory = await category.save();
            res.json({
                status: true,
                msg: "Category add successfully"
            })
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

 
router.get("/getAllProductCategories",async (req,res)=>{
    try{
        let categories=await BrandCategoryModel.find({})
        res.send(categories);
    }catch(err){
        res.status(400).send(err);
    }
})

router.get("/getProductCategoryBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let category=await BrandCategoryModel.find({userId:_id});
        res.send(category);
    }catch(err){
        res.status(404).send("Category Not found");
    }
})

router.patch("/updateProductCategoryBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let category=await BrandCategoryModel.findByIdAndUpdate(_id,body,{new:true});
        res.json({status:true,msg:"Updated category details"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.patch("/updateProductCategoryImageBy/:id",upload().single("categoryImage"),async (req,res)=>{
    try{
        let _id=req.params.id;
        let body={categoryImage:req.file.location};
        let category=await BrandCategoryModel.findByIdAndUpdate(_id,body,{new:true});
        res.json({status:true,msg:"File Uploaded successfully"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.delete("/deleteProductCategoryBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let category=await BrandCategoryModel.findByIdAndDelete(_id);
        res.json({status:true,msg:"Deleted"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.get("/getCategoryByName",async(req,res)=>{
    try{
       let name=req.query.name;
       let data=await BrandCategoryModel.findOne({categoryName:name});
       res.send(data);
    }catch(err){
         res.status(500).send(err);
    }
})

 
module.exports = router;