import { check } from "express-validator";
import {
    Task
  } from "../models";

const title = check("title").not().isEmpty().withMessage("The title should not be empty");
const status = check("status", "status is required").not().isEmpty();
const startDate = check("startDate", "startDate is required").not().isEmpty();
const location = check("location", "location is required").not().isEmpty();
const issuer = check("issuer", "issuer is required").not().isEmpty();


export const taskValidations = [];