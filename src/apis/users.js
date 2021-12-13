import {
  Router
} from "express";
import {
  User
} from "../models";
import {
  AuthenticateValidations,
  RegisterValidations,
} from "../validators/user-validator";
import Validator from "../middlewares/validator-middleware";
import {
  userAuth
} from '../middlewares/auth-guard'
import cookie from 'cookie'

const router = Router();

/**
 * @description To create a new user account
 * @access Public
 * @api /users/api/register
 * @type POST
 *
 */

router.post(
  "/api/register",
  RegisterValidations,
  Validator,
  async (req, res) => {
    // Check the username is taken
    const {
      username,
      email
    } = req.body
    let usernameIsUsed = await User.findOne({
      username: username
    }).exec();
    if (usernameIsUsed) {
      return res.status(400).json({
        success: false,
        message: "Username is already in use",
      });
    }
    let emailIsUsed = await User.findOne({
      email: email
    }).exec();
    if (emailIsUsed) {
      return res.status(400).json({
        success: false,
        message: "email is already in use",
      });
    }
    let user = new User({
      ...req.body,
    });
    await user.save((err, user) => {
      if (err) {
        res.status(500).json(err);
      }
      res.status(201).json(user);
    });
  }
);

/**
 * @description To authenticate an user and get auth token
 * @access Public
 * @api /users/api/authenticate
 * @type POST
 *
 */
router.post(
  "/api/authenticate",
  AuthenticateValidations,
  Validator,
  async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000")
      let {
        username,
        password
      } = req.body
      let userIsValid = await User.findOne({
        username: username
      });
      if (!userIsValid) {
        return res.status(404).json({
          success: false,
          message: "Username/Password is not correct"
        })
      }
      let passwordIsValid = await userIsValid.comparePassword(password)
      if (!passwordIsValid) {
        return res.status(401).json({
          success: false,
          message: "Username/Password is not correct"
        })
      }
      let token = await userIsValid.generateJWT()
      return res
        .cookie('auth', token, {
          httpOnly: true,
          secure: false,
          maxAge:3600,
          SameSite=None
        })
        .status(200)
        .json({
          success: true,
          message: "You are now logged in.",
          token: `Bearer ${token}`,
          user: userIsValid.getUserInfo()
        })
    } catch (e) {
      return res.status(500).json({
        success: false,
        message: `An error occurred ${e}`
      })
    }
  }
);

/**
 * @description To get an authenticated user and get user's profile
 * @access Public
 * @api /users/api/authenticate
 * @type GET
 *
 */

router.get(
  "/api/authenticate",
  userAuth,
  async (req, res) => {
    return res.status(200).json({
      user: req.user
    })
  }
);
export default router;