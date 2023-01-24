import { Router } from "express";
import { productsControl } from "../controllers";
import { resultNotFound} from "../middlewares";

const router = Router();

router.route('/').get(productsControl.getProducts).post(productsControl.createProduct)
router.route('/:product_id').get(productsControl.getProduct).delete(productsControl.deleteProduct).put(productsControl.updateProduct)

export default router;