import express from "express";
import multer from "multer"; 
import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import ProductModel from "./ProductModel.js";
import ReviewModel from "./ReviewModel.js";
import { Op } from "sequelize";
import ValidationError from "sequelize";



const localEndpoint=`${process.env.LOCAL_URL}${process.env.PORT}/products`
/* const serverEndpoint= `${process.env.SERVER_URL}/products` */


const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
      cloudinary, 
      params: {folder: "Products"},
    }),
    limits: { fileSize: 1024 * 1024 },
  }).single("image")



const productRouter = express.Router();

productRouter.get("/", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET products at:", new Date());
        const query={};
        if (req.query.name) query.name = {[Op.iLike]:`%${req.query.name}%`}
        if (req.query.price) query.price = {[Op.between]:req.query.price.split(",")}
        if (req.query.category) query.category = {[Op.iLike]:`%${req.query.category}%`}
        const foundProducts = await ProductModel.findAll({
            where:{...query},
            attributes: req.query.attributes? req.query.attributes.split(","):{}
        })       
        res.status(200).send(foundProducts)        
    }catch(error){ 
        console.log(error)
        next(error)
    }    
})


productRouter.get("/:productId" , async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET product at:", new Date());       
        const foundProduct = await ProductModel.findByPk(req.params.productId, {
            attributes: req.query.attributes? req.query.attributes.split(","):{}})     
        if(foundProduct){
            res.status(200).send(foundProduct);
        }else{next(createHttpError(404, "Product Not Found"));
    } 
    }catch(error){
        next(error);
    }
})


productRouter.post("/", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "POST product at:", new Date());
        const {id} = await ProductModel.create(req.body);        
        res.status(201).send({message:`Added a new product.`, id});
        
    }catch(error){
        if(error.errors && error.errors[0].type === 'Validation error'){
            res.status(400).send({message:`Fields are required and can't include curse words.`});
        }
        
        next(error);
    }
})






productRouter.put("/images/:productId/pic",cloudinaryUploader, async (req,res,next)=>{
    try{     
        console.log("Tried to put a pic.", req.file.path);
        
        const [numUpdated, updatedProducts] = await ProductModel.update({image: req.file.path}, {
            where: { id: req.params.productId },
            returning: true
          })
          console.log(numUpdated)
        if(numUpdated === 1){
            res.status(201).send({message: "Product Pic Uploaded"});
        }else{next(createHttpError(404, "Product Not Found"));}     
    }catch(error){ 
        if(error.errors && error.errors[0].type === 'Validation error'){
            res.status(400).send({message:`Fields are required and can't include curse words.`});
        }
        next(error) }});
    

    
    
    
productRouter.put("/:productId", async (req,res,next)=>{
    try{ 
        console.log(req.headers.origin, "PUT product at:", new Date());
        const [numUpdated, updatedProducts] = await ProductModel.update(req.body, {
            where: { id: req.params.productId },
            returning: true
          })
        if(numUpdated === 1){
            res.status(200).send(updatedProducts[0]);
        }else{next(createHttpError(404, "Product Not Found"));}            
    }catch(error){ 
        next(error);
    }
})


productRouter.delete("/:productId", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "DELETE product at:", new Date());
        const deleted = await ProductModel.destroy({
            where: {id:req.params.productId}
        })
        if(deleted === 1){
            res.status(204).send({message:"Product has been deleted."})
        }else{
            next(createHttpError(404, "Product not found."));    
        }
    }catch(error){
        console.log(error)
        next(error)
    }
})
////______________-------------reviews---------------__________________
productRouter.get("/reviews/", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "Get all reviews at:", new Date());
        const query={};
        if (req.query.comment) query.comment = {[Op.iLike]:`%${req.query.comment}%`}
        if (req.query.rate) query.rate = {[Op.between]:req.query.rate.split(",")}        
        const foundReviews = await ReviewModel.findAll({
            where:{...query},
            attributes: req.query.attributes? req.query.attributes.split(","):{}
        }) 
        if(foundReviews){res.status(200).send(foundReviews)}
        else{createHttpError(404, "Reviews not found.")}
    }catch(error){
        next(error)
    }
})
productRouter.get("/reviews/:productId", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "Get all reviews at:", new Date());
        const query={};
        if (req.query.comment) query.comment = {[Op.iLike]:`%${req.query.comment}%`}
        if (req.query.rate) query.rate = {[Op.between]:req.query.rate.split(",")}        
        const foundReviews = await ReviewModel.findAll({
            where:{...query,productId: req.params.productId },
            attributes: req.query.attributes? req.query.attributes.split(","):{}
        }) 
        if(foundReviews){res.status(200).send(foundReviews)}
        else{createHttpError(404, "Reviews not found.")}
    }catch(error){
        next(error)
    }
})
productRouter.post("/reviews/:productId", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "POST review at:", new Date());
        const {id} = await ReviewModel.create({...req.body, productId:req.params.productId});        
        res.status(201).send({message:`Added a new review.`, id});
        
    }catch(error){
        if(error.errors && error.errors[0].type === 'Validation error'){
            res.status(400).send({message:`Fields are required and can't include curse words.`});
        }
        next(error);
    }
})
productRouter.put("/reviews/:reviewId", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "PUT review at:", new Date());
        const [numUpdated, updatedReviews] = await ReviewModel.update(req.body, {
            where: { id: req.params.reviewId },
            returning: true
          })
        if(numUpdated === 1){
            res.status(200).send(updatedReviews[0]);
        }else{next(createHttpError(404, "Review Not Found"));}       
        
    }catch(error){
        if(error.errors && error.errors[0].type === 'Validation error'){
            res.status(400).send({message:`Fields are required and can't include curse words.`});
        }
        next(error);
    }
})
productRouter.delete("/reviews/:reviewId", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "DELETE review at:", new Date());
        const deleted = await ReviewModel.destroy({
            where: {id:req.params.reviewId}
        })
        if(deleted === 1){
            res.status(204).send({message:"Review has been deleted."})
        }else{
            next(createHttpError(404, "Review not found."));    
        }
    }catch(error){
        next(error)
    }
})


export default productRouter;