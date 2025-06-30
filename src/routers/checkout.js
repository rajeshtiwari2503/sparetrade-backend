const express = require("express");
const router = new express.Router();

const CheckoutModel = require("../models/checkout");


router.post("/addCheckout", async (req, res) => {
    let body = req.body;
    try {
        let checkout=new CheckoutModel(body)
        let addToCheckout = await cart.save();
        res.json({
            status: true,
            msg: "Your item add To checkout"
        })

    } catch (err) {
        res.status(400).send(err);
    }
});


router.get("/getAllCheckout", async (req, res) => {
    try {
        let getCheckoutItemss = await CheckoutModel.find({})
        res.send(getCheckoutItemss);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get("/getCheckoutItemsById/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let getCheckoutItems = await CheckoutModel.find({ userId: _id });
        res.send(getCheckoutItems);
    } catch (err) {
        res.status(404).send("Checkout items Not found");
    }
})

 
router.patch("/updateCheckout/:id",async(req,res)=>{
    try{
      let _id=req.params.id;
      let body=req.body;
      let updateToCheckout= await CheckoutModel.findByIdAndUpdate(_id,body);
      res.json({status:true,msg:"Checkout updated successfully"});
    }catch(err){
      res.status(500).send(err);
    }
});

router.delete("/deleteCartItemBy/:id", async (req, res) => {
    try {
        let _id = req.params.id;
       
        let deleteCheckoutItems = await CheckoutModel.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Deleted" });
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;