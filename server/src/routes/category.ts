import { Router } from "express";
import { categoryControl } from "../controllers";
import {resultNotFound} from "../middlewares";

const router = Router()

router.get('/',categoryControl.getCategories);
router.get('/:category_id', categoryControl.getCategory)
router.post('/', categoryControl.createCategory)
router.delete('/:category_id',categoryControl.deleteCategory)
router.put('/:category_id', categoryControl.udpateCategory)

export default router;