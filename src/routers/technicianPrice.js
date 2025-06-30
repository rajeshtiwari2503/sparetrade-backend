const express=require("express");
const router=express.Router();
const TechnicianPriceModel=require("../models/technicianPrice");

router.post("/addTechnicianPrice",async(req,res)=>{
       try{
        let body=req.body;
        let data=new TechnicianPriceModel(body);
        await data.save();
        res.json({status:true,msg:"Added"});
       }catch(err){
        res.status(400).send(err);
       }
});

router.post("/getAll",async(req,res)=>{
    try{
     let body=req.body;
     let data=new TechnicianPriceModel(body);
     await data.save();
     res.json({status:true,msg:"Added"});
    }catch(err){
     res.status(400).send(err);
    }
});

module.exports=router;