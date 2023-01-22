import express, {Request, Response} from "express";
import { categoryRouter, productRouter } from "./routes";
import cors from "cors";
const app = express();

// middlewares
app.use(cors())
app.use(express.json())
app.get('/', (req:Request, res:Response) => {
    res.send("Hello")
})
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/products', productRouter)


export const PORT = 5050;
export default app;