import {
    validationResult
} from 'express-validator';


const validationMiddleware = (res, req, next) => {
    let errors = validationResult(req);
    console.log(`validator start`)
    console.log(errors)
    if (!errors.isEmpty()) {
        console.log('error for json')
        return res.json({
                errors: errors.array()
            })
        }
        console.log("No error detected")
        next()
}

export default validationMiddleware