import { Request, Response} from "express";
import {DatabaseError} from 'pg'
import { QueryBuilder } from "../helper";
import pool from "../config/db";

const getProducts = async (req:Request, res:Response) => {
    let limit = 10;
    try{
        let {page, ...remaining} = req.query
        let query = QueryBuilder.build.innerJoin('products', 'categories', 'category', 'category_id', ['product_id', 'product_name', 'category_id', 'category_name'], {...remaining})
        if (page) {
            query += `LIMIT ${limit} OFFSET ${(+(page) - 1) * limit}`
        }
        let countQuery = QueryBuilder.build.count('products', 'product_id')
        let {rows, rowCount} = await pool.query(query)
        let {rows:countResult} = await pool.query(countQuery)
        res.status(200).json({total_products: Number(countResult[0].count), products:rows, rowCount, page: Number(page)}) 
    }
    catch (e)  {
        console.log(e)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
};

const getProduct = async (req:Request, res:Response) => {
    let product_id = +(req.params.product_id)
    try{
        let query = QueryBuilder.build.innerJoin('products', 'categories', 'category', 'category_id', ['product_id', 'product_name', 'category_id', 'category_name'], {product_id: product_id})
        let {rows, rowCount} = await pool.query(query)
        if (!rowCount) {
            res.status(404).json({"message": `product with id ${product_id} not found`})
            return;
        }
        res.status(200).json(rows[0])
        return;    
    }
    catch (e)  {
        console.log(e)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
};

const createProduct = async (req:Request, res:Response) => {
    try{
        let errors = {};
        if (!req.body.product_name) {
            errors = {
                ...errors,
                ['product_name']:"product_name is required"
            }
        }
        if (!req.body.category) {
            errors = {
                ...errors,
                ['category']: "category is required"
            }
        }
        if (Object.keys(errors).length) {
            res.status(400).json(errors);
            return;
        }
        let query = QueryBuilder.build.save('products', req.body)
        try {
            let result1 = await pool.query(query, Object.values(req.body))
            let getNewData = QueryBuilder.build.innerJoin('products', 'categories', 'category', 'category_id', ['product_id', 'product_name', 'category_id', 'category_name'], {product_id: result1.rows[0].product_id})
            let {rows} = await pool.query(getNewData)
            res.status(200).json(rows[0]) 
        } catch(err:unknown) {
            if (err instanceof DatabaseError && err.code === '23503') {
                res.status(400).json({"message": `Category with id ${req.body.category} does not exists`})
                return;
            }
            res.send("Something went wrong")
            return;
        }
    }
    catch (e)  {
        console.log(e)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
};

const deleteProduct = async (req:Request, res:Response) => {
    let {product_id} = req.params
    try {
        let query = QueryBuilder.build.delete('products', {product_id})
        let {rows, rowCount} = await pool.query(query)
        if (!rowCount) {
            res.status(400).json({"message": `Product with id ${product_id} not found`})
            return;
        }
        res.status(200).json({"status": "success"})
        return;
    } catch (e) {
        console.log(e)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
};

const updateProduct = async (req:Request, res:Response):Promise<void> => {
    let product_id = +(req.params.product_id)
    try {
        let query = QueryBuilder.build.update('products', {columns: {...req.body}, where: {product_id}})
        try {
            let {rows, rowCount} = await pool.query(query);
            if (!rowCount) {
                res.status(404).json({"message": `product with id ${product_id} does not exists`})
                return;
            }
            res.status(200).json(rows[0]);
            return;
        } catch (err:unknown) {
            if (err instanceof DatabaseError && err.code === '23503') {
                res.status(400).json({"message": `Category with id ${req.body.category} does not exists`})
                return;
            }
            console.log(err);
            res.send("Something went wrong")
        }
    } catch (err) {
        console.log(typeof err)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}


export {getProducts, getProduct, createProduct, deleteProduct, updateProduct};