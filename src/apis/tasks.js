import {
  Router
} from "express";
import {
  DOMAIN
} from "../constants";
import {
  Task,
  User
} from "../models";
import {
  userAuth
} from "../middlewares/auth-guard";
import validator from "../middlewares/validator-middleware";
import {
  taskValidations
} from "../validators/task-validators";
import SlugGenerator from '../functions/slug-generator'

const router = Router();

/**
 * @description To create a new task by the authenticated User
 * @api /tasks/api/create-task
 * @access private
 * @type POST
 */

router.post("/api/create-task", userAuth, taskValidations, validator, async (req, res) => {
  try {
    // Create a new Post
    let {
      body
    } = req;
    let task = new Task({
      createdBy: req.user._id,
      ...body,
      slug: SlugGenerator(body.title)
    });
    await task.save();
    //   console.log("NEW_POST", post);
    return res.status(201).json({
      task,
      success: true,
      message: "Your task is recorded.",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Unable to create the task. ${err}`
    });
  }
});

/**
 * @description To update a new task by the authenticated User
 * @api /tasks/api/update-task
 * @access private
 * @type PUT
 */

router.put('/api/update-task/:id', taskValidations, validator, userAuth, async (req, res) => {
  try {
    let {
      id
    } = req.params;
    let {
      body,
      user
    } = req
    let task = await Task.findById(id);
    if (
      task.createdBy.toString() !== user._id.toString() &&
      task.issuer.toString() !== user._id.toString() &&
      user.role.toString() !== "admin") {
      return res.status(401).json({
        success: false,
        message: `Task doesnt belong to you or your access level is not enough ${user.role}`
      })

    }
    task = await Task.findOneAndUpdate({ _id: id}, {...body, slug: SlugGenerator(body.title)},{ new: true})
    return res.status(200).json({
      task,
      success: true,
      message: `Update post`
    })
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: `Unable ${e}`
    })
  }
})

/**
 * @description To get a list of tasks by authenticated user
 * @api /tasks/api/get-task
 * @access private
 * @type GET
 */

router.get('/api/get-task', userAuth, async (req, res) => {
  try{
    let task = await Task.find()
    return res.status(200).json({
      success: true,
      message: task
    })
  } catch(e) {
    return res.status(400).json({
      success: false,
      message: `${e}`
    })
  }
  
})

/**
 * @description To get a list of recent 5 tasks by authenticated user
 *              
 * @api /tasks/api/get-recent
 * @access private
 * @type GET
 */

router.get('/api/get-recent', userAuth, async (req, res) => {
try{
  let task = await Task.find( { $and:[{urgent: true},{$or: [{status: "in progress"},{status: "pending"}]}]}).sort({startDate: 1}).limit(5)
  console.log(task)
  return res.status(200).json({
    success: true,
    message: task
  })
} catch(e) {
  return res.status(400).json({
    success: false,
    message: `${e}`
  })
}

})

/**
 * @description To get a list of oustadning tasks by authenticated user and the numbers of outstanding task
 *              
 * @api /tasks/api/get-recent
 * @access private
 * @type GET
 */

router.get('/api/get-outstanding', userAuth, async (req, res) => {
try{
  
  let taskNumber = await Task.where( {$or: [{status: "in progress"},{status: "pending"}]}).count()
  return res.status(200).json({
    success: true,
    number: taskNumber,
  })
} catch(e) {
  return res.status(400).json({
    success: false,
    message: `${e}`
  })
}

})

export default router;