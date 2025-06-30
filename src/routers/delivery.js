const express=require("express");
const router=new express.Router();
const axios=require("axios");
const Order=require("../models/order");
const fs=require("fs");
const PickupLocation=require("../models/brandPickupLocation");
const BrandModel=require("../models/brandRegistrationModel");
const CourierModel=require("../models/courierDebit");

const token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FwaXYyLnNoaXByb2NrZXQuaW4vdjEvZXh0ZXJuYWwvYXV0aC9sb2dpbiIsImlhdCI6MTY5NzExMDkzNiwiZXhwIjoxNjk3OTc0OTM2LCJuYmYiOjE2OTcxMTA5MzYsImp0aSI6IlplM1M2ZXJXUm02V2VENnMiLCJzdWIiOjM1OTEyMTcsInBydiI6IjA1YmI2NjBmNjdjYWM3NDVmN2IzZGExZWVmMTk3MTk1YTIxMWU2ZDkifQ.ngrbQwIIDrsFxTeIHepeJFeqsiTvLsVwNeAi1KhsGoE";

// "id": 3591217,
// "first_name": "API",
// "last_name": "USER",
// "email": "help@sparetrade.in",
// "company_id": 278522,
const cron = require('node-cron');
const path = require('path');

const filePath = path.join(__dirname, 'token.txt');
// Simulated token refresh function (replace this with your actual token refresh logic)
function readTokenFromFile() {
   try {
     const token = fs.readFileSync(filePath, 'utf-8');
     return token.trim(); // Remove leading/trailing whitespace
   } catch (error) {
     console.error('Error reading token from file:', error);
     return null;
   }
 }

 const getToken=async()=>{
     try{
      let body={email:"help@sparetrade.in",password:"Sparetrade@12"};
      let response= await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login",body);
      let {data}=response
      return data.token;
     }catch(err){
      console.log("Error occured");
     }
 }
 async function updateTokenInFile() {
     const updatedToken = await getToken();
     fs.writeFileSync(filePath, updatedToken);
 }

function refreshToken() {
 updateTokenInFile();
}

// Define a schedule to run the refreshToken function every 10 days
cron.schedule('0 0 */9 * *', () => {
  refreshToken();
});


router.post("/addPickupLocation",async(req,res)=>{
   try{
       let body=req.body;
       let data=new PickupLocation(body);
       await data.save();
       const currentToken = readTokenFromFile();
       let newBody={
         "pickup_location":body.pickupLocation,
         "name": body.name,
         "email":body.email,
         "phone": body.phone,
         "address": body.address,
         "address_2": body.address2,
         "city": body.city,
         "state":body.state,
         "country": "India",
         "pin_code": body.pinCode
         
      }
       await axios.post("https://apiv2.shiprocket.in/v1/external/settings/company/addpickup",newBody,{headers:{'Authorization':`Bearer ${currentToken}`}})
       res.status(201).json({status:true,msg:"Added"});
   }catch(err){
       res.status(400).send(err);
   }
});

router.post("/createDeliveryOrder",async(req,res)=>{
       try{
          let body=req.body;
          const currentToken = readTokenFromFile();
          let pickupLocation= await PickupLocation.findOne({userId:body.userId});
          if(pickupLocation){
          let finalOrder={...body.orderData,pickup_location:pickupLocation.pickupLocation};
          let response=await axios.post("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",finalOrder,{headers:{'Authorization':`Bearer ${currentToken}`}});
          let {data}=response;
          await Order.updateOne({_id:body.orderData.order_id},{shipOrderId:data.order_id,shipmentId:data.shipment_id});
          res.send(data);
         }else{
            res.status(404).send("Pickup Location not found");
         }
       }catch(err){
          res.status(400).send(err.response.data);
       }
});

router.get("/trackOrder/:id",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let id =req.params.id
      let response=await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${id}`,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err.response.data);
   }
});

router.post("/generateManifest",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let response=await axios.post("https://apiv2.shiprocket.in/v1/external/manifests/generate",body,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err.response.data);
   }
});

router.post("/printManifest",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let response=await axios.post("https://apiv2.shiprocket.in/v1/external/manifests/print",body,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err);
   }
});

router.post("/generateLabel",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let response=await axios.post("https://apiv2.shiprocket.in/v1/external/courier/generate/label",body,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err);
   }
});

router.post("/generateInvoice",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let response=await axios.post("https://apiv2.shiprocket.in/v1/external/orders/print/invoice",body,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err);
   }
});

router.get("/getAllReturns",async(req,res)=>{
   try{
      const currentToken = readTokenFromFile();
    let data=await axios.get("https://apiv2.shiprocket.in/v1/external/orders/processing/return",{headers:{'Authorization':`Bearer ${currentToken}`}});
    res.send(data.data);
   }catch(err){
      res.status(400).send(err);
   }
});

router.get("/getAllShiprocketOrders",async(req,res)=>{
   try{
      const currentToken = readTokenFromFile();
    let data=await axios.get("https://apiv2.shiprocket.in/v1/external/orders",{headers:{'Authorization':`Bearer ${currentToken}`}});
    res.send(data.data);
   }catch(err){
      res.status(400).send(err);
   }
});

router.get("/getSpecificOrder/:id",async(req,res)=>{
   try{
      let id =req.params.id
      const currentToken = readTokenFromFile();
      let response=await axios.get(`https://apiv2.shiprocket.in/v1/external/orders/show/${id}`,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err.response.data);
   }
});

router.post("/generateAWB",async(req,res)=>{
   try{
      let body=req.body;
     const currentToken = readTokenFromFile();
     let response=await axios.post("https://apiv2.shiprocket.in/v1/external/courier/assign/awb",body,{headers:{'Authorization':`Bearer ${currentToken}`}})
     let {data}=response;
     res.send(data);
   }catch(err){
    res.status(400).send(err.response.data)
   }
})
https://apiv2.shiprocket.in/v1/external/courier/track?order_id=123

router.get("/courierList",async(req,res)=>{
   try{
      const currentToken = readTokenFromFile();
     let response=await axios.get("https://apiv2.shiprocket.in/v1/external/courier/courierListWithCounts",{headers:{'Authorization':`Bearer ${currentToken}`}})
     let {data}=response;
     res.send(data);
   }catch(err){
    res.status(400).send(err)
   }
})

router.get("/trackShipment/:id",async(req,res)=>{
   try{
      let id=req.params.id;
      const currentToken = readTokenFromFile();
     let response=await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track?order_id=${id}`,{headers:{'Authorization':`Bearer ${currentToken}`}})
     let {data}=response;
     res.send(data);
   }catch(err){
    res.status(400).send(err)
   }
})

router.get("/trackShipmentbyAWB/:id",async(req,res)=>{
   try{
      let id=req.params.id;
      const currentToken = readTokenFromFile();
     let response=await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${id}`,{headers:{'Authorization':`Bearer ${currentToken}`}})
     let {data}=response;
     res.send(data);
   }catch(err){
    res.status(400).send(err)
   }
})

router.get("/getAllShipment",async(req,res)=>{
   try{
      const currentToken = readTokenFromFile();
     let response=await axios.get("https://apiv2.shiprocket.in/v1/external/shipments",{headers:{'Authorization':`Bearer ${currentToken}`}})
     let {data}=response;
     res.send(data);
   }catch(err){
    res.status(400).send(err)
   }
})

router.post("/shipProduct",async(req,res)=>{
   try{
      const {shipment_id,amount,_id,courier}=req.body;
      const currentToken = readTokenFromFile();
      await axios.post("https://apiv2.shiprocket.in/v1/external/courier/assign/awb",{shipment_id:shipment_id},{headers:{'Authorization':`Bearer ${currentToken}`}})
     let response=await axios.post("https://apiv2.shiprocket.in/v1/external/courier/generate/pickup",body,{headers:{'Authorization':`Bearer ${currentToken}`}})
     let {data}=response;
     res.send(data);
     let brand=await BrandModel.findById(_id);
     if(brand.role==="BRAND" || brand.role==="RESELLER"){
     brand.wallet += -amount;
     await brand.save();
     let courierDebit=new CourierModel({brandId:_id,brandName:brand.brandName,courier:courier,debitAmount:amount});
     await courierDebit.save();
     }
   }catch(err){
    res.status(400).send(err)
   }
})

router.post("/courierAbility",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
     let response=await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${body.pickup_postal_code}&delivery_postcode=${body.delivery_postal_code}&cod=${body.cod}&weight=${body.weight}`,{headers:{'Authorization':`Bearer ${currentToken}`}})
     let {data}=response;
     res.send(data);
   }catch(err){
    res.status(400).send(err)
   }
})

router.post("/cancelOrder",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let response=await axios.post("https://apiv2.shiprocket.in/v1/external/orders/cancel",body,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err);
   }
});

router.post("/cancelShipment",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let response=await axios.post("https://apiv2.shiprocket.in/v1/external/orders/cancel/shipment/awbs",body,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err);
   }
});

router.post("/returnOrder",async(req,res)=>{
   try{
      let body=req.body;
      const currentToken = readTokenFromFile();
      let response=await axios.post("https://apiv2.shiprocket.in/v1/external/orders/create/return",body,{headers:{'Authorization':`Bearer ${currentToken}`}});
      let {data}=response;
      res.send(data);
   }catch(err){
      res.status(400).send(err.response.data);
   }
});

router.get("/getCourierDebitTransaction/:id", async (req, res) => {
   try {
       let id=req.params.id;
       let data = await CourierModel.find({brandId:id});
       res.send(data);
   } catch (err) {
       res.status(500).send(err);
   }
 });

 router.post("/postCourierDebitTransaction", async (req, res) => {
   try {
       let body=req.body;
       let data = new CourierModel(body);
       await data.save();
       res.send("Saved");
   } catch (err) {
       res.status(400).send(err);
   }
 });

module.exports=router;
