const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
require("dotenv").config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({
  origin: '*', // This allows all origins, you can restrict it to your app's domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'jubayerr398@gmail.com',
    pass: `fjnx vmds xvhn kkij`
  }
});






app.get('/', (req, res) => {
    res.send('Hello, Shabuj Global');
});


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w7xbhfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const StudentList = client.db("globalStudents").collection("studentList")

    // the Api Begins

    app.get("/students", async(req, res)=>{
      const result = await StudentList.find().toArray()
      res.send(result)
    })
    app.get("/students/:id", async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const studentData = StudentList.find(filter)
      const result = await studentData.toArray()
      res.send(result)
    })

    app.post("/students", async(req, res)=>{
      const info = req.body;
      const firstName = req.body.firstname
      const lastName = req.body.lastname
      const email = req.body.email
      console.log(email);
      if (email) {
          var mailOptions = {
          from: 'jubayerr398@gmail.com',
          to: email,
          subject: 'Thank you for submitting the form',
          html: 
          `
          <div>
        <h1 style="background-color: cornflowerblue; color: white; text-align: center; font-size: 30px; font-weight: 600; padding: 20px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">Shabuj Global Eduction</h1>
        <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Hello, ${firstName+" "+ lastName}</p>
        <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Thank you for submitting a form our counsellor will contect you soon</p>
        <h1 style="background-color: lightgray; color: black; text-align: center; font-size: 18px; padding: 20px; font-weight: 300;  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">© 2024 Shabuj Global Education. All rights reserved.</h1>
    </div> 
          `
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }

      const result = StudentList.insertOne(info)
      res.send(result)
    })

    app.put("/updateStudents/:id", async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const option = {upsert:true}
      const updatedInfo = req.body
      const firstName = req.body.firstname
      const lastName = req.body.lastname
      const email = req.body.email
      const number = req.body.number
      const qualification = req.body.qualification
      const selectedCountry = req.body.selectedCountry
      const university = req.body.university
      const course = req.body.course
      const Cemail = req.body.counsellorEmail
      const counsellor = req.body.counsellor

      if (email) {
        var mailOptions = {
        from: 'jubayerr398@gmail.com',
        to: Cemail,
        subject: 'You have a meeting with a new student',
        html: 
        `
        <div style="padding:20px;">
      <h1 style="background-color: cornflowerblue; color: white; text-align: center; font-size: 30px; font-weight: 600; padding: 20px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">Shabuj Global Eduction</h1>
      <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Hello, ${counsellor}</p>
      <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >You have a meeting with ${firstName+" "+ lastName}</p>
      <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Phone No: ${number}</p>
      <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Email: ${email}</p>
      <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Academic qualification: ${qualification}</p>
      <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Interested University: ${university}</p>
      <p style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"  >Interested Course: ${course}</p>
      <h1 style="background-color: lightgray; color: black; text-align: center; font-size: 18px; padding: 20px; font-weight: 300;  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif">© 2024 Shabuj Global Education. All rights reserved.</h1>
  </div> 
        `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    }


      const info = {
        $set: updatedInfo
      }
      const result = await StudentList.updateOne(filter,info, option)
      res.send(result)
    })

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(PORT,"0.0.0.0", () => {
  console.log(`App listening at http://localhost:${PORT}`);
});