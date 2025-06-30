const express = require("express");
const router = new express.Router();
const { upload,sendMail } = require("../services/service");
const VideoModel=require("../models/videoModel");

router.post("/uploadVideo",upload().single("video"),async(req,res)=>{
    try{
      let video=req.file.location;
      let body=req.body;
      let body1={...body,video:video};
      let data=new VideoModel(body1);
      let data1=await data.save();
      res.json({status:true,msg:"Video uploaded successfully"});
    }catch(err){
        res.status(400).send(err);
    }
})

router.post("/videoUrl",async(req,res)=>{
  try{
    let body=req.body;
    let data=new VideoModel(body);
    let data1=await data.save();
    res.json({status:true,msg:"Video uploaded successfully"});
  }catch(err){
      res.status(400).send(err);
  }
})

router.get("/getAllVideos",async(req,res)=>{
      try{
        let data= await VideoModel.find({});
        res.send(data);
      }catch(err){
        res.status(400).send(err);
      }
});
router.get("/getAllVideosBybrand/:id",async(req,res)=>{
  try{
    let data= await VideoModel.find({brandId:req.params.id});
    res.send(data);
  }catch(err){
    res.status(400).send(err);
  }
});
router.patch("/editVideo/:id",upload().single("video"),async(req,res)=>{
    try{
      let _id=req.params.id;
      let body={...req.body,video:req.file.location};
      let data= await VideoModel.findByIdAndUpdate(_id,body);
      res.json({status:true,msg:"Video updated successfully"});
    }catch(err){
      res.status(500).send(err);
    }
});

router.delete("/deleteVideo/:id",async(req,res)=>{
    try{
     let _id=req.params.id; 
     let obj= await VideoModel.findByIdAndDelete(_id);
     res.json({status:true,msg:"Video deleted successfully"});
    }catch(err){
     res.status(500).send(err);
    }
});

router.post("/sendMail",async(req,res)=>{
      let {email,pass,isForget}=req.body;
      sendMail(email,pass,isForget);
      res.send("Email sent");     
});

module.exports=router;
