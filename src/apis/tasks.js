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
import mongoose from "mongoose";

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
      enteredTaskData
    } = req.body;
    console.log(enteredTaskData)
    let task = new Task({
      createdBy: mongoose.Types.ObjectId(req.user._id.valueOf()),
      ...enteredTaskData,
      slug: SlugGenerator(enteredTaskData.title)
    });
    
    await task.save();
    console.log("NEW_TASK", task);
    return res.status(201).json({
      task,
      success: true,
      message: "Your task is recorded.",
    });
  } catch (err) {
    return res.status(401).json({
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

router.put('/api/update-task/:_id', taskValidations, validator, userAuth, async (req, res) => {
  try {
    let {
      _id
    } = req.params;
    let {
      body,
      user
    } = req
    console.log(user._id.toString())
    let task = await Task.find({_id: _id}).exec();
    if (
      task.createdBy.toString() !== user._id.toString() &&
      task.issuer.toString() !== user._id.toString() &&
      user.role.toString() !== "admin") {
      return res.status(401).json({
        success: false,
        message: `Task doesnt belong to you or your access level is not enough ${user.role}`
      })

    }
    task = await Task.findOneAndUpdate({
      _id: _id
    }, {
      ...body,
      slug: SlugGenerator(body.title)
    }, {
      new: true
    })
    return res.status(200).json({
      task,
      success: true,
      message: `Update post`
    })
  } catch (e) {
    console.log(e)
    return res.status(400).json({
      success: false,
      message: `Unable ${e}`
    })
  }
})
/**
 * In
 * @description To DELETE a new task by the authenticated User
 * @api /tasks/api/delete-task
 * @access private
 * @type DELETE
 */
 router.delete('/api/delete-task/:slug', taskValidations, validator, userAuth, async (req, res) => {
  try {
    let {
      slug
    } = req.params;
    let {
      body,
      user
    } = req
    Task.remove({})
    let task = await Task.find({slug: slug}).exec();
    if (
      task.createdBy.toString() !== user._id.toString() &&
      task.issuer.toString() !== user._id.toString() &&
      user.role.toString() !== "admin") {
      return res.status(401).json({
        success: false,
        message: `Task doesnt belong to you or your access level is not enough ${user.role}`
      })

    }
    task = await Task.findOne({
      _id: id
    }, {
      ...body,
      slug: SlugGenerator(body.title)
    }, {
      new: true
    })
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
 * @description To get a specific task by the authenticated User using slug
 * @api /tasks/api/get-task/:slug
 * @access private
 * @type GET
 */

 router.get('/api/get-task/:slug', validator, userAuth, async (req, res) => {
  try {
    let {
      slug
    } = req.params;
    let task = await Task.find({slug: slug}).exec();
    return res.status(200).json({
      task,
      success: true,
      message: `You got your post`
    })
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: `Unable to fetch the post, maybe something wrong in your request${e}`
    })
  }
})
/**
 * @description To get a list of recent tasks of defined number in params by authenticated user
 *              
 * @api /tasks/api/get-recent/:number
 * @access private
 * @type GET
 */

router.get('/api/get-recent/:number', userAuth, async (req, res) => {
  
try{
  let { number } = req.params
  let task = await Task.find( { $and:[{urgent: true},{$or: [{status: "in progress"},{status: "pending"}]}]}).sort({startDate: 1}).limit(parseInt(number))

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
 * @description To get number of outstanding tasks
 * @api /tasks/api/get-outstanding
 * @access private
 * @type GET
 */

router.get('/api/get-outstanding', userAuth, async (req, res) => {
try{
  //let taskQuery = await Task.where( {$or: [{status: "in progress"},{status: "pending"}]})
  let taskNumber = await Task.where( {$or: [{status: "in progress"},{status: "pending"}]}).count()
  return res.status(200).json({
    success: true,
    number: taskNumber,
    //message: taskQuery
  })
} catch(e) {
  return res.status(400).json({
    success: false,
    message: `${e}`
  })
}

})

export default router;