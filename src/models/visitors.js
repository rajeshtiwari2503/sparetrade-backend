const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: {type: String,required: true,unique: true},
},{timestamps:true});

const Visitor = mongoose.model('Visitor', visitorSchema);

module.exports = Visitor;