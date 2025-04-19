const express =require('express')
const cors=require('cors')
const {connect, default: mongoose} =require ('mongoose')

require('dotenv').config()

const userRoutes=require('./routes/userRoutes')
const postRoutes=require('./routes/postsRoutes')
const {notFound ,errorHandler}=require('./middelware/errorMiddelware')

const app=express();

app.use(express.json({extended:true}))
app.use(express.urlencoded({extended:true}))
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001',process.env.REACT_APP_URL ];

app.use(cors({
  credentials: true,
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use('/api/users',userRoutes)
app.use('/api/posts',postRoutes)
app.get('/',(req,res)=>{
    res.send('API is running')
})
app.use(notFound)
app.use(errorHandler)
const url=process.env.MONGO__URI
mongoose.connect(url).then(app.listen(5000,()=>console.log(`server running on port ${process.env.PORT}`))).catch(error=>(console.log(error)))
