import express from "express";
import { acceptAppointment, addAppointment, getAppointments } from "../controller/appointment.js";

const appointmentRouter = express.Router();

appointmentRouter.post("/appointments", addAppointment);
appointmentRouter.get("/appointments", getAppointments);
appointmentRouter.post("/appointments/accept", acceptAppointment);

export default appointmentRouter;