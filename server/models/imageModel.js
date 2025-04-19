const {Schema,model}=require('mongoose')
const imageSchema=new Schema({
    thumbnail:{type:String,required:true},
    img:
	{
		data: Buffer,
		contentType: String
	}
})
module.exports=model("image",imageSchema)