// import { NextFunction, Request, Response } from "express"
// import { nextTick } from "process";
// import pool from "../config/db";
// import { QueryBuilder } from "../helper";

// const paginatedResult = (query:string, pk:string) => {
//     return async (req:Request, res:Response, next:NextFunction) => {
//         let {page} = req.query;
//         let limit = 10;
//         try {
//             if (page) {
//                 if (query.toLowerCase().includes('where')) {
//                     query += `AND ${pk} > ${limit * (Number(page) - 1)} LIMIT ${limit}`;
//                 } else {
//                     query += `WHERE ${pk} > ${limit * (Number(page) - 1)} LIMIT ${limit}`;
//                 }
//             }    
//             let {rows, rowCount} = await pool.query(query);
//             res['data'] = {
//                 products: rows,
//                 page: page,
//                 rowCount
//             }
//             next();
//         } catch (e) {
//             console.log(e)
//             res.status(500).json({"message": "something went wrong"})
//         }
//     }
// } 

// export default paginatedResult;