const {Router} =require('express')


const {registerUser,loginUser,getUser,changeAvatar,editUser,getAuthors}=require("../controllers/userControllers")
const authMiddelware=require('../middelware/authMiddelware')

const router=Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.get('/:id',getUser)
router.get('/',getAuthors)
router.post('/change-avatar',authMiddelware,changeAvatar)
router.patch('/edit-user',authMiddelware,editUser)




module.exports=router