require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const multer = require('multer');
const Grid = require("gridfs-stream");
const database = mongoose.connection;
const mongoString = process.env.DATABASE_URL;
const Model = require('./Model/model');
const {GridFsStorage} = require("multer-gridfs-storage");
const crypto = require("crypto");
const routes = require('./Router/routes');




app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
app.use(express.static(path.join(__dirname)));
app.use('/users', routes);

const connect = mongoose.createConnection(mongoString);
mongoose.connect(mongoString, { useNewUrlParser: true });

let gfs, gridfsBucket;

connect.once("open", () => {
gridfsBucket = new mongoose.mongo.GridFSBucket(connect.db, {
bucketName: 'uploads'

});

  gfs = Grid(connect.db, mongoose.mongo);
  gfs.collection("uploads");
  console.log("Connection Successful");
});

/*const storage = new GridFsStorage({
  url: mongoString,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    });
  }
});

const upload = multer({ storage })


app.post('/users', upload.array('uploadFile', 3), async(req, res, next) => {
  const newData = new Model({
      name: req.body.name,
      city: req.body.city,
      imageOne: req.body.imageOne,
      imageTwo: req.body.imageTwo,
      imageThree: req.body.imageThree,
      cost:req.body.cost,
      heritage: req.body.heritage,
      places: req.body.places,
      information: req.body.information
  })


  try {
      const dataToSave = await newData.save();
      res.status(200).json(dataToSave);
  } catch (error) {
      res.status(400).json({errorMessage: error})
  }

})*/

app.get('/images/:filename', async(req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    //console.log(file)
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }

    // Check if image
    if (file.contentType === "image/jpeg" || file.contentType === "image/png") {
      // Read output to browser
      //const readstream = gfs.createReadStream(file.filename);
      //const readstream = gridfsBucket.openDownloadStream(file.id);
      const readstream = gridfsBucket.openDownloadStreamByName(file.filename)
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image"
      });
    }

  });

})



app.listen(PORT, () => console.log(`Server running at port:${PORT}`))