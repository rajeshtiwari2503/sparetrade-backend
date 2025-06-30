const express=require("express");
const router=new express.Router();
const Notification=require("../models/notification");

router.post("/createNotification",async(req,res)=>{
    try{
        let body=req.body;
        let data=new Notification(body);
        let data1= await data.save();
        res.send({status:true,msg:"Created"});
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/allNotification",async(req,res)=>{
    try{
        let data=await Notification.find({});
        res.send(data);
    }catch(err){
       res.status(400).send(err);
    } 
});

router.get("/notificationByBrand/:id",async(req,res)=>{
    try{
        let id=req.params.id;
        let data=await Notification.find({brandId:id});
        res.send(data);
    }catch(err){
       res.status(400).send(err);
    } 
});

module.exports=router;