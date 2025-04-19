const {Schema,model} =require('mongoose')
const mongoose=require('mongoose')
const commenSchema=new Schema({
  userId: { type: mongoose.Schema.ObjectId, ref:'User', required: true },
  postId: { type: mongoose.Schema.ObjectId, ref:'Post', required: true },
  text:{type:String, required:true},
}, { timestamps: true })
module.exports=model('Comment',commenSchema)