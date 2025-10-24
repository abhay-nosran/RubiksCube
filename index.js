const express = require("express") 
const app = express() ;
const path = require("path") 
const PORT = 3100 ;

app.use(express.static(path.join(__dirname,'public'))) ;


app.get("/",(req,res)=>{
    res.sendFile("index.html") ;
    console.log("dfs")  
})

app.get("/steps",(req,res)=>{
    const cubeString = req.query.cubeString ; 
    console.log(cubeString) ;
    res.status(500).json({message : "Not Implemented Right now !"}) ;
})
app.listen(PORT,()=>{
    console.log(`Rubiks Cube is listening on ${PORT}`) ;
})