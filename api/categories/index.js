import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoryModel from "./CategoryModel.js";




const localEndpoint=`${process.env.LOCAL_URL}${process.env.PORT}/categories`
/* const serverEndpoint= `${process.env.SERVER_URL}/categories` */


const categoryRouter = express.Router();

categoryRouter.get("/", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET all categories at:", new Date());
        const query={};
        if (req.query.category) query.category = {[Op.iLike]:`%${req.query.category}%`}
        const foundCategories = await CategoryModel.findAll({
            where:{...query},
            attributes: req.query.attributes? req.query.attributes.split(","):{}
        })       
        res.status(200).send(foundCategories)        
    }catch(error){ 
        console.log(error)
        next(error)
    }    
})


categoryRouter.get("/:categoryId" , async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "GET specific category at:", new Date());       
        const foundCategory = await CategoryModel.findByPk(req.params.productId, {
            attributes: req.query.attributes? req.query.attributes.split(","):{}})     
        if(foundCategory){
            res.status(200).send(foundCategory);
        }else{next(createHttpError(404, "Category Not Found"));
    } 
    }catch(error){
        next(error);
    }
})


categoryRouter.post("/", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "POST category at:", new Date());
        const {id} = await CategoryModel.create(req.body);        
        res.status(201).send({message:`Added a new category.`, id});
        
    }catch(error){
        if(error.errors && error.errors[0].type === 'Validation error'){
            res.status(400).send({message:`Fields are required and can't include curse words.`});
        }
        
        next(error);
    }
})

categoryRouter.post("/bulk", async (req, res, next) => {
    try {
      const categories = await CategoryModel.bulkCreate(req.body.map(
        category => {return {name: category}}
      ))
      res.send(categories.map(c => c.categoryId))
    } catch (error) {
      next(error)
    }
  })




    
categoryRouter.put("/edit/:categoryId", async (req,res,next)=>{
    try{ 
        console.log(req.headers.origin, "PUT category at:", new Date());
        const [numUpdated, updatedCategory] = await CategoryModel.update(req.body, {
            where: { id: req.params.categoryId },
            returning: true
          })
        if(numUpdated === 1){
            res.status(200).send(updatedCategory[0]);
        }else{next(createHttpError(404, "Category Not Found"));}            
    }catch(error){ 
        next(error);
    }
})

categoryRouter.put("/edit/bulk", async (req,res,next)=>{
    try{ 
        console.log(req.headers.origin, "PUT category at:", new Date());
        const query={};
        if (req.query.category) query.category = {[Op.iLike]:`%${req.query.category}%`}
        const [numUpdated, updatedCategories] = await CategoryModel.update(req.body, {
            where: { ...query },
            returning: true
          })
        if(numUpdated > 0){
            res.status(200).send({...updatedCategories});
        }else{next(createHttpError(404, "Category Not Found"));}            
    }catch(error){ 
        next(error);
    }
})


categoryRouter.delete("/delete/:categoryId", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "DELETE category at:", new Date());
        const deleted = await CategoryModel.destroy({
            where: {id:req.params.categoryId}
        })
        if(deleted === 1){
            res.status(204).send({message:"Category has been deleted."})
        }else{
            next(createHttpError(404, "Category not found."));    
        }
    }catch(error){
        console.log(error)
        next(error)
    }
})

categoryRouter.delete("/delete/bulk", async (req,res,next)=>{
    try{
        console.log(req.headers.origin, "DELETE category at:", new Date());
        const query={};
        if (req.query.category) query.category = {[Op.iLike]:`%${req.query.category}%`}
        const deleted = await CategoryModel.destroy({
            where: {...query}
        })
        if(deleted > 0){
            res.status(204).send({message:`${deleted} categories have been deleted.`})
        }else{
            next(createHttpError(404, "No categories found."));    
        }
    }catch(error){
        console.log(error)
        next(error)
    }
})

export default categoryRouter;
