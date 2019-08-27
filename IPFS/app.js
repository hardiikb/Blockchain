const ipfsApi = require("ipfs-http-client")
const express = require("express")
const fs = require("fs")
const formidable = require("formidable")
const app = express()

// IPFS configuration
const ipfs = ipfsApi('ipfs.infura.io', '5001', {protocol: "https"})

app.get("/", function(req,res){
  res.sendFile(__dirname + '/index.html')
})

app.post("/addfile", function(req,res){
  var formdata = new formidable.IncomingForm()
  formdata.parse(req);
  
  formdata.on('fileBegin', (name, file) => {
      file.path = __dirname + '/' + file.name
      console.log(file.path)
  })
  
  formdata.on('file', function (name, file){
      console.log('Uploaded ' + file.name);
      let testFile = fs.readFileSync(file.name)
      //let testBuffer = new Buffer(testFile)

      ipfs.add(testFile, function (err, file) {
          if (err) {
            console.log(err);
          }
          let fileHash = file[0]["hash"]
          let fileLink = "https://gateway.ipfs.io/ipfs/" + fileHash
          return res.json(fileLink)
      })
  });
  /*
    Adding file to ipfs using infura. Once uploaded, we will get a hash
    of the file. Using that hash, we can access our file.
  */
})

app.listen(3000, () => console.log('App listening on port 3000!'))
