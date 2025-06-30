const express = require("express");
const router = new express.Router();

const AddToCartModel = require("../models/addToCart");
//dfgh

router.post("/addToCart", async (req, res) => {
    let body = req.body;
    try {
        let cart=new AddToCartModel(body)
        let addToCart = await cart.save();
        res.json({
            status: true,
            msg: "Your item add To cart"
        })

    } catch (err) {
        res.status(400).send(err);
    }
});


router.get("/getAllCartItems", async (req, res) => {
    try {
        let getCartItems = await AddToCartModel.find({})
        res.send(getCartItems);
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get("/getCartItemsById/:id", async (req, res) => {
    try {
        let _id = req.params.id;
        let getCartItems = await AddToCartModel.find({ userId: _id });
        res.send(getCartItems);
    } catch (err) {
        res.status(404).send("Cart items Not found");
    }
})

 
router.patch("/updateAddtoCart/:id",async(req,res)=>{
    try{
      let _id=req.params.id;
      let body=req.body;
      let updateToCart= await AddToCartModel.findByIdAndUpdate(_id,body);
      res.json({status:true,msg:"Quantity updated successfully"});
    }catch(err){
      res.status(500).send(err);
    }
});

router.delete("/deleteCartItemBy/:id", async (req, res) => {
    try {
        let _id = req.params.id;
       
        let deleteCartItems = await AddToCartModel.findByIdAndDelete(_id);
        res.json({ status: true, msg: "Deleted" });
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;