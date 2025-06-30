const mongoose=require("mongoose");

const exchanges=new mongoose.Schema({
    exchange_id:{type:String},
    name:{type:String},
    iconUrl:{type:String},
    volume_1day_usd:{type:Number}
});

const Exchange = mongoose.model('Exchange', exchanges);

module.exports = Exchange;
