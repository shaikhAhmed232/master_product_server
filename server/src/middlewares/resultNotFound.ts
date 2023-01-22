import { Request, Response,NextFunction } from "express"
import pool from "../config/db";
import { QueryBuilder } from "../helper";

const categoriesResultNotFound = async (req:Request, res:Response, next:NextFunction) => {
    let {category_id} = req.params;
    let filterQuery = QueryBuilder.build.filter('categories', {where: {category_id: category_id}})
    let filterResult = await pool.query(filterQuery)
    if (filterResult.rowCount === 0) {
        res.status(404).json({"message": `category with id ${category_id} not found`});
        return;
    }
    next();
}

const productsResultNotFound = async (req:Request, res:Response, next:NextFunction) => {
    let {product_id} = req.params;
    let filterQuery = QueryBuilder.build.filter('products', {where: {product_id}})
    let filterResult = await pool.query(filterQuery)
    if (filterResult.rowCount === 0) {
        res.status(404).json({"message": `product with id ${product_id} not found`});
        return;
    }
    next();
}

export {categoriesResultNotFound, productsResultNotFound};