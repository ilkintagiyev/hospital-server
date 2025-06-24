import { db } from "../index.js";
import { verifyToken } from "../utils/middleware.js";

export const addAppointment = async (req, res) => {
    const profile = await verifyToken(req, res);
    const { date, doctorId } = req.body;

    console.log(profile?.id);

    try {
        const checkQuery = `SELECT id FROM appointments WHERE doctor_id = ? AND appointment_date = ?`;
        db.query(checkQuery, [doctorId, date], (checkErr, checkResults) => {
            if (checkErr) {
                console.error("Check error:", checkErr);
                return res.status(500).json({ message: "Verilənlər yoxlanılarkən xəta baş verdi." });
            }

            if (checkResults.length > 0) {
                return res.status(409).json({
                    message: "Bu tarix və saatda artıq bu həkim üçün görüş mövcuddur.",
                });
            }

            const insertQuery = `
        INSERT INTO appointments (user_id, appointment_date, doctor_id)
        VALUES (?, ?, ?)
      `;
            db.query(insertQuery, [profile?.id, date, doctorId], (insertErr, result) => {
                if (insertErr) {
                    console.error("Insert error:", insertErr);
                    return res.status(500).json({ message: "Görüş əlavə olunarkən xəta baş verdi." });
                }

                return res.status(201).json({ message: "Görüş uğurla təyin olundu." });
            });
        });
    } catch (error) {
        console.error("DB Error:", error);
        return res.status(500).json({ message: "Serverdə xəta baş verdi." });
    }
};



export const getAppointments = async (req, res) => {
    const profile = await verifyToken(req, res);

    try {
        // Əvvəlcə doctor id-ni tapırıq users tablosundakı id-yə görə
        const doctorQuery = `SELECT id FROM doctors WHERE user_id = ?`;
        db.query(doctorQuery, [profile?.id], (docErr, docResults) => {
            if (docErr) {
                console.error("Doctor tapılmadı:", docErr);
                return res.status(500).json({ message: "Həkim tapılarkən xəta baş verdi." });
            }

            if (docResults.length === 0) {
                return res.status(404).json({ message: "Həkim tapılmadı." });
            }

            const doctorId = docResults[0].id;

            const getAppointmentsQuery = `
                SELECT 
                    a.id AS appointment_id,
                    a.appointment_date,
                    u.name AS user_name,
                    u.surname AS user_surname,
                    u.email AS user_email
                FROM appointments a
                JOIN users u ON a.user_id = u.id
                WHERE a.doctor_id = ?
                ORDER BY a.appointment_date DESC
            `;

            db.query(getAppointmentsQuery, [doctorId], (appErr, appointments) => {
                if (appErr) {
                    console.error("Appointments alınarkən xəta:", appErr);
                    return res.status(500).json({ message: "Görüşlər alınarkən xəta baş verdi." });
                }

                return res.status(200).json(appointments);
            });
        });
    } catch (error) {
        console.error("Server Xətası:", error);
        return res.status(500).json({ message: "Serverdə xəta baş verdi." });
    }
};


export const acceptAppointment = async (req, res) => {
    const profile = await verifyToken(req, res);
    const { appointmentId } = req.body;


    try {
        // Əvvəlcə görüş məlumatını tap
        const getQuery = `SELECT * FROM appointments WHERE id = ?`;
        db.query(getQuery, [appointmentId], (getErr, results) => {
            if (getErr || results.length === 0) {
                return res.status(404).json({ message: "Görüş tapılmadı." });
            }

            const appointment = results[0];

            // Yeni cədvələ əlavə et
            const insertQuery = `
                INSERT INTO accepted_appointments (user_id, doctor_id, appointment_date)
                VALUES (?, ?, ?)
            `;
            db.query(insertQuery, [appointment.user_id, appointment.doctor_id, appointment.appointment_date], (insertErr) => {
                if (insertErr) {
                    return res.status(500).json({ message: "Görüş qəbul edilərkən xəta baş verdi." });
                }

                // Əsas görüşü sil
                const deleteQuery = `DELETE FROM appointments WHERE id = ?`;
                db.query(deleteQuery, [appointmentId], (deleteErr) => {
                    if (deleteErr) {
                        return res.status(500).json({ message: "Əsas görüş silinə bilmədi." });
                    }

                    return res.status(200).json({ message: "Görüş uğurla qəbul edildi." });
                });
            });
        });

    } catch (err) {
        return res.status(500).json({ message: "Server xətası." });
    }
};