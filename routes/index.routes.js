const express=require('express')
const router=express.Router();
const upload=require('../config/multer.config')
const authMiddleware=require('../middleware/authe')
const firebase=require('../config/firebase.config')
const fileModels=require('../models/files.models')

router.get('/home',authMiddleware,async(req,res)=>{
    //finding uploaded files
    try{
    const userFiles=await fileModels.find({
        user:req.user.userId
    })
    console.log(userFiles)

//error handling
throw('error')

    //showing uploaded files in front end ie home
res.render('home',{
    files: userFiles
})
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            message:'server error'
        })
    }
})
router.post('/upload',authMiddleware,upload.single('file'),authMiddleware,async(req,res)=>{
    const newFile=await fileModels.create({
        path:req.file.path,
        originalname:req.file.originalname,
        user:req.user.userId
        
    })
    res.json(newFile)
})

router.get('/download/:path',authMiddleware,async(req,res)=>{
    
    const loggedInUserId=req.user.userId;
    const path=req.params.path;


    const file=await fileModels.findOne({
        user: loggedInUserId,
        path:path
    })

    if(!file){
        return res.status(401).json({
            message:'unauthorized'
        })
    }

    const signedUrl=await firebase.storage().bucket().file(path).getSignedUrl({
        action:'read',
        expires: Date.now()+60*1000
    })
    res.redirect(signedUrl([0]))
})




 module.exports=router 