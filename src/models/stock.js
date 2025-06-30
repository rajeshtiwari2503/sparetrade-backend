const mongoose=require("mongoose");

const stockSchema = new mongoose.Schema({
    name: String,
    price: Number,
  });
  
const Stock = new mongoose.model('Stock', stockSchema);

module.exports=Stock;
