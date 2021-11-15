import {
    Router
} from 'express';
import {
    User
} from '../models';
import {
    RegisterValidations
} from '../validators/user-validator';
import Validator from '../middlewares/validator-middleware'

const router = Router();

/**
 * @description To create a new user account
 * @access Admin
 * @api /users/api/register
 * @type POST
 * 
 */

router.post('/api/register', RegisterValidations, Validator, async (req, res) => {

})
export default router;