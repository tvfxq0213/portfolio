const express = require('express');
const router = express.Router();
const { Project } = require("../models/Project");

const multer = require('multer');


//=================================
//             Project
//=================================

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage:storage}).single("file")

router.post('/uploadfiles', (req,res)=>{

  //이미지를 서버에 저장한다. 
  upload(req, res, err =>{
    if(err) {
      return res.json({success: false, err})
    }else{
      return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
    }
  })

});



router.post('/uploadProject', (req,res)=>{

  //이미지를 정보들을 저장한다.
  const project = new Project(req.body);
  project.save((err, doc) => {
    if(err) return res.json({success: false, err})
    res.status(200).json({success: true})
  })

});

router.get('/getProjects', (req,res)=>{

  //이미지를 DB에서 가져와서 클라이언트에 보낸다. 
  console.log(req.query)

  if(req.query.category == 0){
    Project.find()
    .populate('writer')
    .exec((err, projects )=>{
      if(err) return res.status(400).send(err)
      res.status(200).json({success: true, projects})
    })
  }else{
    const category = req.query.category
    Project.find({category})
    .populate('writer')
    .exec((err, projects )=>{
      if(err) return res.status(400).send(err)
      res.status(200).json({success: true, projects})
    })
  }

});

router.post('/getProjectDetail', (req,res)=>{

  //이미지를 DB에서 가져와서 클라이언트에 보낸다.  
  Project.findOne({ "_id" : req.body.projectId })
  .populate('writer')
  .exec((err, project) => {
      if(err) return res.status(400).send(err);
      res.status(200).json({ success: true, project })
  })

});



router.post("/deleteProject", (req, res) => {

  Project.findOneAndDelete({"_id":req.body.projectId})
  .exec((err, result)=>{
    if(err) return res.status(400).send(err)
    return res.status(200).json({success:true})
  })

});


router.post("/updateProject", (req, res) => {
  
  console.log("=======updateProject============")
  const filter = {'_id':req.body.projectId}

  const project = req.body.data;



  Project.findOneAndUpdate(filter, project, {
    new: true,
    upsert: true,
    rawResult: true
  })
  .exec((err, project) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
        success: true
    });

  });
  

});

module.exports = router;