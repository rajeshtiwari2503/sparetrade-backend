const express = require("express");
const router = new express.Router();
const BrandModel = require("../models/brandRegistrationModel");
const TransactionModel=require("../models/brandTransaction");
const Notification=require("../models/notification");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const JWTStrategry = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const { smsSend,sendMail,upload } = require("../services/service");
const multer=require("multer");
const params = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secrectOrKey: "jwtsecret6434568"
}

const jwtExpirySeconds = 300;

router.post("/brandRegistration",upload().single("gstDocument"),async (req, res) => {
    let body = req.body;
    try {
        let check = await BrandModel.findOne({email:body.email});
        let bool=false;
        if (check) {
            res.json({ status: false, msg: "Email already exists" });
        } else {
            let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            let obj = { ...body, otp: otp,gstDocument:req.file.location };
            let brand = new BrandModel(obj);
            let newBrand = await brand.save();
            smsSend(otp, body.contact);
            sendMail(body.email,body.password,bool);
            let notify=new Notification({name:body.brandName,category:"BRAND",id:newBrand._id,brandId:newBrand._id,title:"New brand registered"});
            await notify.save();
            res.json({
                status: true,
                msg: "Registerd successfully"
            })
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post("/adminRegistrationBrand",upload().single("brandLogo"),async(req,res)=>{
     try{
        let body=req.body;
        let brand=new BrandModel({...body,brandLogo:req.file.location,status:"ACTIVE",role:"BRAND"});
        let brand1=await brand.save();
        res.json({status:true,msg:"Registerd successfully"});
     }catch(err){
        res.status(400).send(err);
     }
});

router.post("/brandLogin", async (req, res) => {
    try {
        let body = req.body;
        let checkBrand = await BrandModel.findOne({ email: body.email, password: body.password });
        if (checkBrand) {
            let payload = { _id: checkBrand._id };
            let token = jwt.sign(payload, params.secrectOrKey, {
                algorithm: "HS256",
                expiresIn: jwtExpirySeconds
            })
            if (checkBrand.status === "INACTIVE") {
                let otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false }); 
                await BrandModel.findByIdAndUpdate({ _id: checkBrand._id }, { otp: otp });
                smsSend(otp, checkBrand.contact);
            }
            res.json({ status: true, user: checkBrand, msg: "Login successfully", token: "bearer " + token });
        } else {
            res.json({ status: false, msg: "Incorrect Username and Password" });
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

router.patch("/updateTotalPay/:id",async(req,res)=>{
    try{
      let _id=req.params.id; 
      let body=req.body;
      let brand=await BrandModel.findById(_id);
      if(brand.totalDue===0){
        res.json({status:false,msg:"No Payment Due"});
      }else if(brand.totalDue<body.totalPay){
        res.json({status:false,msg:"Payment due is less than Total Payment"});
      }
      else{
      let brand1=await BrandModel.findByIdAndUpdate(_id,{totalPay:brand.totalPay+body.totalPay,totalDue:brand.totalDue-body.totalPay},{new:true});
      let trsn=new TransactionModel({brandId:_id,brandName:brand.brandName,totalPay:body.totalPay,paidAmount:body.paidAmount,commission:body.commission,totalDue:brand1.totalDue});
      let trsn1=await trsn.save();
      let notify=new Notification({name:brand.brandName,category:"TRANSACTION",id:trsn1._id,brandId:_id,title:`Paid ${body.totalPay} INR successfully`});
      await notify.save();
      res.send({status:true,msg:"Updated"});
      }
    }catch(err){
    res.status(500).send(err);
    }
});

router.get("/getAllTransaction",async(req,res)=>{
    try{
       let transaction=await TransactionModel.find({});
       res.send(transaction.reverse());
    }catch(err){
      res.status(400).send(err);
    }
});

router.patch("/updateWallet/:id",async(req,res)=>{
    try{
        let body=req.body;
        let _id=req.params.id;
        let brand=await BrandModel.findById(_id);
        brand.wallet += -(+body.amount);
        await brand.save();
        res.json({status:true,msg:"Wallet Updated"});
    }catch(err){
      res.status(400).send(err);
    }
});

router.get("/getTransactionBy/:id",async(req,res)=>{
    try{
       let id=req.params.id
       let transaction=await TransactionModel.find({brandId:id});
       res.send(transaction.reverse());
    }catch(err){
      res.status(400).send(err);
    }
});

router.get("/getAdminDetail",async(req,res)=>{
    try{
        let admin=await BrandModel.findOne({role:"ADMIN"}).select("_id");
        res.send(admin);
    }catch(err){
        res.status(400).send(err);
    }
});

router.patch("/brandOtpVerification", async (req, res) => {
    try {
        let body = req.body;
        let brand = await BrandModel.findOne({ email: body.email, otp: body.otp });
        if (brand) {
            let brand1 = await BrandModel.findByIdAndUpdate({ _id: brand._id }, { status: "ACTIVE" });
            res.json({ status: true, msg: "Verified" });
        } else {
            res.send({ status: false, msg: "Incorrect OTP" });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/brandResendOtp",async (req,res)=>{
    try{
        let body=req.body;
        let otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false,lowerCaseAlphabets:false });
        let brand=await BrandModel.findOneAndUpdate({email:body.email},{otp:otp});
        if(brand){
            smsSend(otp,brand.contact);
            res.json({status:true,msg:"OTP sent"});
        }else{
            res.json({status:false , msg:"Something went wrong!"});
        }
    }catch(err){
        res.status(400).send(err);
    }
});

router.patch("/brandForgetPassword",async(req,res)=>{
    try{
      let body=req.body;
      let bool=true;
      let brand=await BrandModel.findOneAndUpdate({email:body.email},{password:body.password});
      if(brand){
         res.json({status:true,msg:"Password changed successfully!"});
        sendMail(body.email,body.password,bool);
      }else{
         res.json({status:false,msg:"Something went wrong!"});
      }
    }catch(err){
     res.status(500).send(err);
    }
})

router.get("/getAllBrands",async (req,res)=>{
    try{
        let brands=await BrandModel.find({$or:[{role:"BRAND"},{role:"RESELLER"}]}).select("id role revenue totalPay totalDue brandName email contact address approval aboutUs gstNo createdAt brandLogo brandBanner gstDocument");
        res.send(brands);
    }catch(err){
        res.status(400).send(err);
    }
})

router.get("/getBrandBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let brand=await BrandModel.findById(_id);
        res.send(brand);
    }catch(err){
        res.status(404).send("Brand Not found");
    }
})

router.patch("/updateBrandBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let brand=await BrandModel.findByIdAndUpdate(_id,body,{new:true});
        res.json({status:true,msg:"Updated brand details"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.patch("/updateBrandGstDocumentBy/:id",upload().single("file"),async (req,res)=>{
    try{
        let _id=req.params.id;
        let gstDocument=req.file.location;
        let brand=await BrandModel.findByIdAndUpdate(_id,{gstDocument:gstDocument},{new:true});
        res.json({status:true,msg:"Updated gst document"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.patch("/updateBrandLogoBy/:id",upload().single("file"),async (req,res)=>{
    try{
        let _id=req.params.id;
        let brandLogo=req.file.location;
        let brand=await BrandModel.findByIdAndUpdate(_id,{brandLogo:brandLogo},{new:true});
        res.json({status:true,msg:"Updated brand logo"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.patch("/updateBrandBannerBy/:id",upload().single("file"),async (req,res)=>{
    try{
        let _id=req.params.id;
        let brandBanner=req.file.location;
        let brand=await BrandModel.findByIdAndUpdate(_id,{brandBanner:brandBanner},{new:true});
        res.json({status:true,msg:"Updated brand banner"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.delete("/deleteBrandBy/:id",async (req,res)=>{
    try{
        let _id=req.params.id;
        let brand=await BrandModel.findByIdAndDelete(_id);
        res.json({status:true,msg:"Deleted"});
    }catch(err){
        res.status(500).send(err);
    }
});

router.patch("/brandApproval/:id",async(req,res)=>{
    try{
        let _id=req.params.id;
        let body=req.body;
        let brand=await BrandModel.findByIdAndUpdate(_id,body);
        let msg=body.approval==="APPROVED" ?  "APPROVED" : "DISAPPROVED";
        res.json({status:true,msg:msg});
    }catch(err){
        res.status(500).send(err);
    }
})

// const storage= multer.memoryStorage();
// const upload3= multer({storage:storage});
// router.post("/upload",upload3.single("img"),async(req,res)=>{
//     //console.log(req.file)
//        const res1=await upload1(req.file);
//        res.send(res1);
// });

module.exports = router;