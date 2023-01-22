import { Request, Response } from "express";
import pool from "../config/db";
import { QueryBuilder } from "../helper";

// Fetching all categories
const getCategories = async (req:Request, res:Response):Promise<void> => {
    try {
        let query  = QueryBuilder.build.filter('categories', {columns: ['category_id', 'category_name'], where: {...req.query}})
        let {rows, rowCount} = await pool.query(query)
        res.status(200).json({"categories": rows, rowCount})
    } catch (err) {
        console.log(err)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

// fetching single category
const getCategory = async (req:Request, res:Response):Promise<void> => {
    let {category_id} = req.params
    try {
        let query  = QueryBuilder.build.filter('categories', {columns: ['category_id', 'category_name'], where: {category_id}})
        let {rows, rowCount} = await pool.query(query)
        res.status(200).json(rows[0])
        return;
    } catch (err) {
        console.log(err)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

const createCategory = async (req:Request, res:Response):Promise<void> => {
    let data = req.body
    try {
        let errors = {}
        if (!req.body.category_name) {
            errors = {
                ...errors,
                ['category_name']: "category_name is required"
            }
        }
        if (Object.keys(errors).length) {
            res.status(400).json(errors)
            return;
        }
        let filterQuery = QueryBuilder.build.filter('categories', {columns: ['category_id', 'category_name'], where: {category_name: req.body.category_name}})
        let result1 = await pool.query(filterQuery)
        if (result1.rowCount !== 0) {
            res.status(400).json({"message": `category ${req.body.category_name} already exists`})
            return;
        }
        let query = QueryBuilder.build.save('categories', data)
        let result2 = await pool.query(query, Object.values(data))
        let result3 = await pool.query(filterQuery)
        res.status(201).json(result3.rows[0])
        return;
    } catch (e) {
        console.log(e)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

const deleteCategory = async (req:Request, res:Response) => {
    let {category_id} = req.params
    try {
        let query = QueryBuilder.build.delete('categories', {category_id})
        let result = await pool.query(query)
        res.status(200).json({"status": "success"})
        return;
    } catch (err) {
        console.log(err)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

const udpateCategory = async (req:Request, res:Response) => {
    let {category_id} = req.params
    try {
        let filterQuery = QueryBuilder.build.filter('categories', {columns: ['category_id', 'category_name'], where: req.body})
        let {rows, rowCount} = await pool.query(filterQuery)
        if (rowCount !== 0 && rows[0].category_id !== +(req.params.category_id)) {
            console.log(rows[0], req.params)
            res.status(400).json({"message": `category ${req.body.category_name} already exists`})
            return;
        }
        let query = QueryBuilder.build.update('categories', {columns: {...req.body}, where: {category_id}})
        let result = await pool.query(query);
        res.status(200).json(result.rows);
        return;
    } catch (err) {
        console.log(err)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

export {getCategories, getCategory, createCategory, deleteCategory, udpateCategory}