import { check } from "express-validator";


const title = check("title", "Title is required").not().isEmpty();
const status = check("status", "status is required").not().isEmpty();
const startDate = check("startDate", "startDate is required").not().isEmpty();
const location = check("location", "location is required").not().isEmpty();
const issuer = check("issuer", "issuer is required").not().isEmpty();


export const taskValidations = [title, status, startDate, location, issuer];