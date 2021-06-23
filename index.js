const express = require("express");
const app = express();
const port = 80;
const cors = require("cors");
const libre = require('libreoffice-convert');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
app.use(cors());
app.use(express.json())
// const imgToPDF = require('image-to-pdf');
const PDFDocument = require('pdfkit');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
//const upload = multer({ storage });
const upload = multer({ storage: multer.memoryStorage() })
// app.post("/join",(req, res)=>{
//     res.send({ message:"join" })
// })
app.post('/single', upload.single('profile'), (req, res) => {
    try {

      res.send(req.file);
    }catch(err) {
      res.status(400);
    }
});

app.post('/convert', upload.single('profile'), (req, res) => {
    try {        
        const extend = '.pdf'
        libre.convert(req.file.buffer, extend, undefined, (err, done) => {
            if (err) {
              console.log(`Error converting file: ${err}`);
            }
            res.header('Content-Type', 'application/x-pdf');
            res.attachment(`${req.file.originalname}${extend}`);
            res.send(done);
        });
    }catch(err) {
        console.log(err)
        res.status(400);
    }
});
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });
app.get("/call", (req, res) => {
const extend = '.pdf'
const enterPath = path.join(__dirname, '/mario-course.xlsx');
const outputPath = path.join(__dirname, `/result/mario-course${extend}`);
 
// Read file
const file = fs.readFileSync(enterPath);
// Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
libre.convert(file, extend, undefined, (err, done) => {
    if (err) {
      console.log(`Error converting file: ${err}`);
    }
    
    // Here in done you have pdf file which you can save or transfer in another stream
    fs.writeFileSync(outputPath, done);
});
    res.send({ message:"call" })
});

app.get("/call2", (req, res) => {
    const extend = '.pdf'
    const enterPath = path.join(__dirname, '/mario-course.xlsx');
    const outputPath = path.join(__dirname, `/result/mario-course${extend}`);
     
    // Read file
    const file = fs.readFileSync(enterPath);
    // Convert it to pdf format with undefined filter (see Libreoffice doc about filter)
    libre.convert(file, extend, undefined, (err, done) => {
        if (err) {
          console.log(`Error converting file: ${err}`);
        }
        
        // Here in done you have pdf file which you can save or transfer in another stream
        res.header('Content-Type', 'application/x-pdf');
        res.attachment(`ejemplo.pdf`);
        res.send(done);
    });
        
    });

// app.get("/image", (req, res) => {

//     const pages = [
//         "image.jpg"
//      ]
      
//      imgToPDF(pages, 'A4')
//         .pipe(fs.createWriteStream('output.pdf'));
//     res.send({ message:"call" })
// });

app.post('/convert-image', upload.single('profile'), (req, res) => {
   

    try {        
        const extend = '.pdf'
        const doc = new PDFDocument({ margin: 0, size:'A4' });
        res.header('Content-Type', 'application/x-pdf');
        res.attachment(`${req.file.originalname}${extend}`);
        doc.image(req.file.buffer, 0, 0, { fit: [595.28, 841.89], align: 'center', valign: 'center' });
        doc.end();
        doc.pipe(res)
    }catch(err) {
        console.log(err)
        res.status(400);
    }
});


app.listen(port, () => console.log(`Server listening on port ${port}!`));


