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
    // Check the username is taken
    let user = await User.findOne({ username })
    if(user) {
        return res.status(400).json({
            success: false,
            message: "Username is already in use"
        })
    }
})
export default router;