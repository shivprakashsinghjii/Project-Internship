import express from 'express';
const app=express();
app.get('/',(req,res)=>{
  res.send("Hi Hello")
})
app.listen(3000);