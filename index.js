import  express, { response } from "express";
import bcrypt, { compare } from "bcrypt";
import dotenv from "dotenv";
import {MongoClient,ObjectId} from "mongodb";
import cors from "cors";
import  jwt  from "jsonwebtoken";
import nodemailer from "nodemailer"
// import {auth} from "./middleware/auth.js"

const PORT=3001;
const MONGO_URL=" mongodb+srv://sriram1102:sri1102@cluster0.jw0oa.mongodb.net";
const UNIQUE_KEY="This is unique one";
const app=express();
app.use(express.json());
app.use(cors());

//Mongodb Connect
export async function createConnection()
{
  const client=new MongoClient(MONGO_URL);
  return await client.connect();
}


async function genpassword(userPassword)
    {
      const salt= await bcrypt.genSalt(10);
       const haspassword=await bcrypt.hash(userPassword,salt);
      return (haspassword);
    }

    async function searchedMail(emailId){
    const client = await createConnection();
    const result = await client
                .db("colorcombinator")
                .collection("user")
                .findOne({emailId:emailId})

                return result;

    }
//Signup
app.post("/signup",async(req,res)=>{
    const {userName,emailId,userPassword}=req.body;
    const value=await searchedMail(emailId);
    if(!value){
      const hashedpassword=await genpassword(userPassword);
      const client = await createConnection();
            const result = await client
              .db("colorcombinator")
              .collection("user")
              .insertOne({
                  userName:userName,
                   emailId:emailId,
                   userPassword:hashedpassword,
                   top:{"light":[],"dark":[]},
                   bottom:{"light":[],"dark":[]}
           });

           
var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'sriramsaravanan11@outlook.com',
    pass: 'Sriram4924'
  }
}); 

var mailOptions = {  
  from: 'sriramsaravanan11@outlook.com',
  to: emailId,
  subject: 'Welcome message',
  text: 'Colorcombinator welcomes you!!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else { 
    console.log('Email sent: ' + info.response);
  }
});
    }
else{
  res.send({msg:"existing mailid"})
}
    
})

async function searchedUser(userEmailId)
{
    const client = await createConnection();
    const result = await client 
  

                   .db("colorcombinator")
                   .collection("user")
                   .findOne({"emailId":userEmailId});
                 return result;
}
//login
app.post("/login",async(req,res)=>{ 
    const{emailId,password}=req.body;
    const value=await searchedUser(emailId);

      if(value!=null)
      {
        const passindb=value.userPassword;
        const passinlogin=password;
        const ispasstrue=await bcrypt.compare(passinlogin,passindb);

     
     if(ispasstrue)
        {
          const token=jwt.sign({id:value._id},UNIQUE_KEY);
           res.send({token:token,id:value._id,value:value});
       }
        else{
          res.send({msg:"invalid login"});
        }
      }   
        else
      {
        res.send({msg:"wrong user"});
      
      }
})

//closet

// app.put("/closet",async(req,res)=>{
//   const{portion,color,index,id} =req.body;
//  const client = await createConnection();
//   if(portion=="top" && index<30 ){
//      const result = await client
//           .db("colorcombinator")
//           .collection("user")
//           .updateOne({_id:ObjectId(id)},{$push:{"top.light":color}})
//     }
//     else if(portion=="top" && index>30 ){
//       const result = await client
//       .db("colorcombinator")
//       .collection("user")
//       .updateOne({_id:ObjectId(id)},{$push:{"top.dark":color}})
//     }

//    else if(portion=="bottom" && index<30){ 
//      const result = await client
//     .db("colorcombinator")
//     .collection("user")
//     .updateOne({_id:ObjectId(id)},{$push:{"bottom.light":color}})
//     }   

//     else{
//       const result = await client
//       .db("colorcombinator")
//       .collection("user")
//       .updateOne({_id:ObjectId(id)},{$push:{"bottom.dark":color}})
//     }
// })


app.put("/closet",async(req,res)=>{
  const{portion,color,index,id} =req.body;
 const client = await createConnection();

     const result = await client
          .db("colorcombinator")
          .collection("user")
          .updateOne({_id:ObjectId(id)}, {$push:{"bottom.dark":{$each:["darkcany","darkslategray","darkgoldenrod"]}}} )

  })

  // {$push:{"top.light":{$each:["sandybrown","rose","skyblue"]}}},
  //         {$push:{"top.dark":{$each:["black","navy","grey"]}}},
  //         {$push:{"bottom.light":{$each:["white","tan","lightgrey"]}}},
  //         {$push:{"bottom.dark":{$each:["darkcany","darkslategray","darkgoldenrod"]}}}
//ideas from closet

app.post("/ideas",async(req,res)=>{
  const{id,preTopColor,preBotColor}=req.body;
  console.log(id,preTopColor,preBotColor);
  // var topIndex=
  const client = await createConnection();
  const result = await client
    .db("colorcombinator")
    .collection("user")
    .findOne({_id:ObjectId(id)})
 
    
  res.send(result);
})

app.pos
app.listen(PORT,()=>console.log("sev started"));

