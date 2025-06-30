const express = require("express");
const router = new express.Router();
const ReviewModel=require("../models/reviewModal");

router.post("/createReview",async(req,res)=>{
    try{
        let body=req.body;
        let data=new ReviewModel(body);
        await data.save();
        res.json({status:true,msg:"Posted"});
    }catch(err){
        res.status(400).send(err);
    }
})

router.get("/getAllReviews",async(req,res)=>{
      try{
        let data= await ReviewModel.find({});
        res.send(data);
      }catch(err){
        res.status(400).send(err);
      }
});

router.get("/getReviewByProductId/:id",async(req,res)=>{
    try{
      let id=req.params.id; 
      let data= await ReviewModel.find({productId:id});
      res.send(data);
    }catch(err){
      res.status(400).send(err);
    }
});

router.get("/getReviewById/:id",async(req,res)=>{
    try{
      let _id=req.params.id; 
      let data= await ReviewModel.findById(_id);
      res.send(data);
    }catch(err){
      res.status(400).send(err);
    }
});

router.get("/getReviewCustomerId/:id",async(req,res)=>{
    try{
      let id=req.params.id; 
      let data= await ReviewModel.find({customerId:id});
      res.send(data);
    }catch(err){
      res.status(400).send(err);
    }
});

router.patch("/editReview/:id",async(req,res)=>{
    try{
      let _id=req.params.id; 
      let body=req.body;
      let data= await ReviewModel.findByIdAndUpdate(_id,body);
      res.json({status:true,msg:"Updated"});
    }catch(err){
      res.status(400).send(err);
    }
});

module.exports=router;