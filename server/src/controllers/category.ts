import { Request, Response } from "express";
import { DatabaseError } from "pg";
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
    let category_id = +(req.params.category_id)
    try {
        let query  = QueryBuilder.build.filter('categories', {columns: ['category_id', 'category_name'], where: {category_id}})
        let {rows, rowCount} = await pool.query(query)
        if (!rowCount) {
            res.status(404).json({"message": `Category with id ${category_id} not found`})
            return;
        }
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
        try{
            let query = QueryBuilder.build.save('categories', data)
            let {rows} = await pool.query(query, Object.values(data))
            res.status(201).json(rows[0])
            return;
        } catch(err:unknown) {
            if (err instanceof DatabaseError && err.code === '23505') {
                res.status(400).json({['category_name']: `${req.body.category_name} alrady exists`})
                return;
            }
            console.log(err)
            res.send('something went wrong');
        } 
        
    } catch (e) {
        console.log(e)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

const deleteCategory = async (req:Request, res:Response):Promise<void> => {
    let {category_id} = req.params
    try {
        let query = QueryBuilder.build.delete('categories', {category_id})
        let {rowCount} = await pool.query(query)
        if (!rowCount) {
            res.status(404).json({"message": `Category not found`})
            return;
        }
        res.status(200).json({"status": "success"})
        return;
    } catch (err) {
        console.log(err)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

const udpateCategory = async (req:Request, res:Response):Promise<void> => {
    let {category_id} = req.params
    try {
        
        let query = QueryBuilder.build.update('categories', {columns: {...req.body}, where: {category_id}})
        try {
            let {rows, rowCount} = await pool.query(query);
            if (!rowCount) {
                res.status(404).json({"message": "category not found"})
                return;
            }
            res.status(200).json(rows[0]);
            return;
        } catch (err:unknown) {
            if (err instanceof DatabaseError && err.code === '23505') {
                res.status(400).json({['category_name']: err.detail})
            }
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({"message": "something went wrong please try again later"})
    }
}

export {getCategories, getCategory, createCategory, deleteCategory, udpateCategory}