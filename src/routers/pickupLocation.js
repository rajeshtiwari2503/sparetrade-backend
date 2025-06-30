const express=require("express");
const router= express.Router();
const PickupLocation= require("../models/brandPickupLocation");

router.get("/getPickupLocationbyUser/:id",async(req,res)=>{
    try{
       let id=req.params.id;
       let data= await PickupLocation.findOne({userId:id});
       res.send([data]);
    }catch(err){
        res.status(500).send(err);
    }
})

router.get("/getAllPickupLocation",async(req,res)=>{
    try{
       let data= await PickupLocation.find({});
       res.send(data);
    }catch(err){
        res.status(500).send(err);
    }
})

router.patch("/updatePickupLocation/:id",async(req,res)=>{
    try{
       let _id=req.params.id;
       let body=req.body;
       let data= await PickupLocation.findByIdAndUpdate(_id,body);
       res.json({status:true,msg:"Updated"});
    }catch(err){
        res.status(500).send(err);
    }
})

module.exports=router;

