const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const app = express();
app.use(cors());
app.use(express.json());
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'sklsysfy',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
app.get('/api/usage', async (req,res)=>{
  try{
    const r = await cloudinary.api.usage();
    const bytes = r.storage.usage;
    const limit = 25*1024*1024*1024;
    res.json({success:true, bytes, limit, pct:(bytes/limit)*100, raw:r});
  }catch(e){ res.status(500).json({success:false, error:e.message}); }
});
app.post('/api/delete', async (req,res)=>{
  try{
    const {public_id, type} = req.body;
    let rt='image'; if(type?.startsWith('video/')) rt='video'; else if(type && !type.startsWith('image/')) rt='raw';
    const result = await cloudinary.uploader.destroy(public_id, {resource_type:rt});
    res.json({success:true, result});
  }catch(e){ res.status(500).json({success:false, error:e.message}); }
});
app.get('/', (req,res)=>res.send('ChiNhel Backend Running! /api/usage'));
app.listen(process.env.PORT || 3000, '0.0.0.0', ()=>console.log('Running'));
