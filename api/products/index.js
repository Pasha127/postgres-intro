import express from "express";
import multer from "multer"; 
import createHttpError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import ProductModel from "./model.js";
import { Op } from "sequelize";



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
    }catch(error){ next(error) }});
    

    
    
    
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
        const numDeleted = await ProductModel.destroy({
            where: {id:req.params.productId}
        })
        if(deletedProduct){
            res.status(204).send({message:"product has been deleted."})
        }else{
            next(createHttpError(404, "product Not Found"));    
        }
    }catch(error){
        next(error)
    }
})
////______________-------------reviews---------------__________________
//productRouter.post("/:productId/reviews/", checkReviewSchema, checkReviewValidationResult, async (req,res,next)=>{
//    try{
//        console.log(req.headers.origin, "POST product review at:", new Date());  
//
//        res.status(201).send({message:`Added a new review.`});
//        
//    }catch(error){
//        console.log(error);
//    }
//})
//productRouter.get("/:productId/reviews/:reviewId" , async (req,res,next)=>{
//    try{
//        console.log(req.headers.origin, "GET product at:", new Date());       
//        const foundProduct = await productModel.findById(req.params.productId)       
//        if(foundProduct){
//            const foundReview = foundProduct.reviews.find(review => review._id.toString()===req.params.reviewId)
//            console.log(foundReview)
//            if(foundReview){
//            res.status(200).send(foundReview);
//            }else{next(createHttpError(404, "Review Not Found"));}
//        }else{next(createHttpError(404, "Product Not Found"));
//    } 
//    }catch(error){
//        console.log(error);
//    }
//})
//productRouter.get("/:productId/reviews" , async (req,res,next)=>{
//    try{
//        console.log(req.headers.origin, "GET product at:", new Date());       
//        const foundProduct = await productModel.findById(req.params.productId)       
//        if(foundProduct){
//            res.status(200).send(foundProduct.reviews);            
//        }else{next(createHttpError(404, "Product Not Found"));
//    } 
//}catch(error){
//    console.log(error);
//}
//})
//
//productRouter.put("/:productId/reviews/:reviewId" , async (req,res,next)=>{
//    try{
//        console.log(req.headers.origin, "PUT product at:", new Date());       
//        const foundProduct = await productModel.findById(req.params.productId);
//        if(foundProduct){            
//            const foundReviewIndex = foundProduct.reviews.findIndex(review => review._id.toString()===req.params.reviewId);
//            if(foundReviewIndex>-1){                
//                foundProduct.reviews[foundReviewIndex] = {
//                    ...foundProduct.reviews[foundReviewIndex],
//                    ...req.body
//                }
//                await foundProduct.save()
//               
//            res.status(200).send({message: "Review updated successfully!"});
//            }else{next(createHttpError(404, "Review Not Found"));}
//        }else{next(createHttpError(404, "Product Not Found"));
//    } 
//    }catch(error){
//        console.log(error);
//    }
//})
//
//
//productRouter.delete("/:productId/reviews/:reviewId" , async (req,res,next)=>{
//    try{
//        console.log(req.headers.origin, "DELETE product at:", new Date());       
//        const foundProduct = await productModel.findById(req.params.productId)       
//        if(foundProduct){
//            const foundReview = foundProduct.reviews.find(review => review._id.toString()===req.params.reviewId)
//            console.log(foundReview)
//            const foundReviewIndex = foundProduct.reviews.findIndex(review => review._id.toString()===req.params.reviewId)
//            if(foundReviewIndex>-1){
//                const deletedReview = await productModel.findByIdAndUpdate(req.params.productId,{$pull:{reviews:{_id: req.params.reviewId}}},{new:true});
//                console.log(deletedReview)
//            res.status(200).send(foundReview);
//            }else{next(createHttpError(404, "Review Not Found"));}
//        }else{next(createHttpError(404, "Product Not Found"));
//    } 
//    }catch(error){
//        console.log(error);
//    }
//})

export default productRouter;