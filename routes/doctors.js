import express from "express";
import { getDoctorById, getDoctors, getDoctorsByService, updateDoctor } from "../controller/doctors.js";

const doctorRouter = express.Router();

doctorRouter.get("/doctors", getDoctors);
doctorRouter.get("/relatedDoctors/:service_id", getDoctorsByService)
doctorRouter.get("/aboutDoctor/:id", getDoctorById);
doctorRouter.put("/doctors", updateDoctor);

export default doctorRouter;