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
    
    let task = new Task({
      createdBy: mongoose.Types.ObjectId(req.user._id.valueOf()),
      ...enteredTaskData,
      slug: SlugGenerator(enteredTaskData.title)
    });
    
    await task.save();
  ;
    return res.status(201).json({
      task,
      success: true,
      message: "Your task is recorded.",
    });
  } catch (err) {
    return res.status(404.5).json({
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

router.put('/api/update-task/:_id', async (req, res) => {
  try {
    let {
      _id
    } = req.params;
    let {
      body,
    } = req
    let task = await Task.findById({_id}).exec();
    task = await Task.findOneAndUpdate({
      _id: _id
    }, {
      ...body
    }, {
      new: true
    })
    return res.status(200).json({
      task,
      success: true,
      message: `Updated task "${task.title}" at ${task.updatedAt}`
    })
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: `Unable ${e}`
    })
  }
})
/**
 * In
 * @description To DELETE a task by the authenticated User
 * @api /tasks/api/delete-task/:_id
 * @type DELETE
 */
 router.delete('/api/delete-task/:_id', taskValidations, validator, userAuth, async (req, res) => {
  try {
    let {
      _id
    } = req.params;
    let {
      body,
      user
    } = req
    console.log(mongoose.Types.ObjectId(_id))
    let task = await Task.findById({_id}).exec();
    console.log(task)
    if (
      task.createdBy.toString() !== user._id.toString() &&
      user.role.toString() !== "admin") {
      return res.status(401).json({
        success: false,
        message: `Task doesnt belong to you or your access level is not enough ${user.role}`
      })
    }
    Task.findByIdAndDelete(_id, function(err){
      if (err) console.log(err);
      console.log("Deleted")
    })
    return res.status(200).json({
      task,
      success: true,
      message: `Deleted post${_id}`
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
 * @description To get a specific task by the authenticated User using _id
 * @api /tasks/api/get-task/:_id
 * @access private
 * @type GET
 */

 router.get('/api/get-task/:_id', validator, userAuth, async (req, res) => {
  try {
    let {
      _id
    } = req.params;
    console.log(req.cookies.auth)
    let task = await Task.findById({_id}).exec();
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
  let task = await Task.find( { $and:[{urgent: true},{$or: [{status: "inProgress"},{status: "pending"}]}]}).sort({startDate: 1}).limit(parseInt(number))

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
  let taskNumber = await Task.where( {$or: [{status: "inProgress"},{status: "pending"}]}).count()
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
/**
 * @description To get detail for the homepage
 * @api /tasks/api/get-home
 * @access private
 * @type GET
 */

 router.get('/api/get-home', userAuth, async (req, res) => {
  try{
    let taskQueryOfOutstanding = await Task.find( { $and:[{urgent: true},{$or: [{status: "inProgress"},{status: "pending"}]}]}).sort({startDate: 1}).limit(5)
    let taskNumberOfOutstanding = await Task.where( {$or: [{status: "inProgress"},{status: "pending"}]}).count()
    let taskNumberOfCompleted = await Task.where({status: "completed"}).count()
    return res.status(200).json({
      success: true,
      completedNumber: taskNumberOfCompleted,
      outstandingNumber: taskNumberOfOutstanding,
      outstandingTask: taskQueryOfOutstanding,
      user: req.user
      //message: taskQuery
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
 * @api /tasks/api/get-completed
 * @access private
 * @type GET
 */

 router.get('/api/get-completed', userAuth, async (req, res) => {
  try{
    //let taskQuery = await Task.where( {$or: [{status: "in progress"},{status: "pending"}]})
    let taskNumber = await Task.where({status: "completed"}).count()
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