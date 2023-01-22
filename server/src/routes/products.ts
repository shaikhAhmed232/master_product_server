import { Router } from "express";
import { productsControl } from "../controllers";
import { resultNotFound} from "../middlewares";

const router = Router();

router.route('/').get(productsControl.getProducts).post(productsControl.createProduct)
router.route('/:product_id').get(resultNotFound.productsResultNotFound, productsControl.getProduct).delete(resultNotFound.productsResultNotFound, productsControl.deleteProduct).put(resultNotFound.productsResultNotFound, productsControl.updateProduct)

export default router;