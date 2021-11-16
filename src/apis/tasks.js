import { Router } from "express";
import { DOMAIN } from "../constants";
import { Post, User } from "../models";
import { userAuth } from "../middlewares/auth-guard";
import validator from "../middlewares/validator-middleware";
import { taskValidations } from "../validators/task-validators";

const router = Router();

/**
 * @description To create a new task by the authenticated User
 * @api /posts/api/create-post
 * @access private
 * @type POST
 */

router.post("/api/create-task", userAuth, taskValidations,validator, async (req, res) => {
  try {
    // Create a new Post
    let { body } = req;
    let post = new Post({
      author: req.user._id,
      ...body,
      slug: SlugGenerator(body.title),
    });
    await post.save();
    //   console.log("NEW_POST", post);
    return res.status(201).json({
      post,
      success: true,
      message: "Your post is published.",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "Unable to create the post.",
    });
  }
});
