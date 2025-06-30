const express=require("express");
const router=new express.Router();
const Order=require("../models/order");
const Technician=require("../models/technicianStatus");
const BrandModel=require("../models/brandRegistrationModel");
const ReturnOrder=require("../models/retuenOrder");
const Notification=require("../models/notification");
const { default: axios } = require("axios");

router.post("/createOrder",async(req,res)=>{
    try{
      let body=req.body;
      let ids=body.items.map(f1=>({id:f1.brandId,mrp:f1.MRP*f1.quantity}));
      ids.map(async (id)=>{
      let br=await BrandModel.findOne({_id:id.id});
      await BrandModel.updateOne({_id:id.id},{revenue:br.revenue+id.mrp,totalDue:br.totalDue+id.mrp});
    });

      let order=new Order(body);
      let order1=await order.save();
      ids.map(async(id)=>{
      let notify=new Notification({name:body.name,category:"ORDER",id:order1._id,brandId:id.id,title:"A new order created"});
      await notify.save();
    })
      res.send(order1);
    }catch(err){
        res.status(400).send(err);
    }
});

//Return order

router.post("/createReturnOrder",async(req,res)=>{
       try{
        let body=req.body;
        let order=new ReturnOrder(body);
        let returnOrder=await order.save();
        let notify=new Notification({name:body.name,category:"RETURN",id:returnOrder._id,brandId:body.items?.[0].brandId,title:"A new return order created"});
        await notify.save();
        res.send(returnOrder);
       }catch(err){
        res.status(400).send(err);
       }
});

router.get("/getReturnOrder/:id",async(req,res)=>{
    try{
     let order= await ReturnOrder.findOne({orderId:req.params.id});
     res.send(order);
    }catch(err){
     res.status(400).send(err);
    }
});

router.get("/getReturnOrderByCustomer/:id",async(req,res)=>{
    try{
     let order= await ReturnOrder.find({customerId:req.params.id});
     res.send(order);
    }catch(err){
     res.status(400).send(err);
    }
});

router.get("/getAllReturnOrder",async(req,res)=>{
    try{
     let order= await ReturnOrder.find({});
     res.send(order);
    }catch(err){
     res.status(400).send(err);
    }
});

//Technician Status for Order

router.post("/createTechnicianStatus",async(req,res)=>{
    try{
      let body=req.body;
      let exist = await Technician.findOne({orderId:body.orderId});
      if (exist) {
        await Technician.updateOne({orderId:body.orderId},{status:body.status});
        res.send({status:true,msg:"Updated"});
      }else{
      let status=new Technician(body);
      let status1=await status.save();
      res.send(status1);
      }
    }catch(err){
        res.status(400).send(err);
    }
});

router.patch("/updateClosed/:id",async(req,res)=>{
    try{
        let body=req.body;
        let id=req.params.id;
        let exist = await Technician.findOne({orderId:id});
        if (exist) {
          await Technician.updateOne({orderId:id},{closed:body.closed});
          res.send({status:true,msg:"Updated"});
        }else{
        res.json({status:false,msg:"Not found"});
        }
      }catch(err){
          res.status(400).send(err);
      }
});

router.patch("/updateShipOrderId/:id",async(req,res)=>{
    try{
       let body=req.body;
       let _id=req.params.id;
      if(body.status==="DELIVER"){
       let order=await Order.findByIdAndUpdate(_id,{status:body.status});
       }else{
        let order=await Order.findByIdAndUpdate(_id,{status:body.status});
        let br=await BrandModel.findOne({_id:body.brandId});
        let brand=await BrandModel.updateOne({_id:body.brandId},{revenue:br.revenue-(body.MRP*body.quantity),totalDue:br.totalDue-(body.MRP*body.quantity)});
       }   
       res.json({status:true,msg:"Updated"}); 
    }catch(err){
       res.status(500).send(err);
    }
});

router.get("/getTechnicianStatus/:id",async(req,res)=>{
    try{
       let id=req.params.id
       let status=await Technician.findOne({orderId:id});
       res.send(status);
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/getAllTechnicianStatus",async(req,res)=>{
    try{
       let status=await Technician.find({});
       res.send(status);
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/getAllOrder",async(req,res)=>{
    try{
       let orders=await Order.find({});
       res.send(orders.reverse());
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/getOrderById/:id",async(req,res)=>{
    try{
       let _id=req.params.id
       let orders=await Order.findById(_id);
       res.send(orders);
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/getOrderBrand/:id",async(req,res)=>{
    try{
       let id=req.params.id
       let orders=await Order.find({});
       let orders1=orders.filter(ord=>ord.items.find(f1=>f1.brandId===id));
       res.send(orders1);
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/getOrderByCustomer/:id",async(req,res)=>{
    try{
       let id=req.params.id; 
       let orders=await Order.find({customerId:id});
       res.send(orders);
    }catch(err){
        res.status(400).send(err);
    }
});

router.get("/getOrderBy/:id",async(req,res)=>{
    try{
       let id=req.params.id; 
       let order=await Order.findOne({customerId:id});
       res.send(order);
    }catch(err){
        res.status(400).send(err);
    }
});

module.exports=router;
// a2 d2
