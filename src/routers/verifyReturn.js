const express=require("express");
const router=new express.Router();
const VerifyReturn=require("../models/productReturnVerify");
const {upload}=require("../services/service")

router.post("/verifyReturnOrder",upload().single("video"),async(req,res)=>{
       let body=req.body;
       try{
        let video=req.file.location;
        let body1={...body,video:video};
        let data=new VerifyReturn(body1);
        let data1=await data.save();
        res.json({status:true,msg:"Uploaded"});
       }catch(err){
        res.status(400).send(err);
       }
});

router.get("/getReturnVerify/:id",async(req,res)=>{
       let id=req.params.id;
       try{
        let data=await VerifyReturn.findOne({orderId:id});
        res.send(data);
       }catch(err){
        res.status(400).send(err);
       }
});

router.get("/getReturnVerifyByBrand/:id",async(req,res)=>{
    let id=req.params.id;
    try{
     let data=await VerifyReturn.find({brandId:id});
     res.send(data);
    }catch(err){
     res.status(400).send(err);
    }
});

router.patch("/updateReturnVerify/:id",async(req,res)=>{
    let _id=req.params.id;
    let body=req.body;
    try{
     let data=await VerifyReturn.findByIdAndUpdate(_id,body);
     res.json({status:true,msg:"Verified"});
    }catch(err){
     res.status(400).send(err);
    }
});


module.exports=router;


