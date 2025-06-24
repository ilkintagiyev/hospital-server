import { db } from "../index.js";
import { verifyToken } from "../utils/middleware.js";

export const getDoctors = async (req, res) => {
    try {
        const query = `
      SELECT 
        d.id AS doctor_id,
        u.id AS user_id,
        u.name,
        u.surname,
        u.email,
        u.telephone,
        d.photo,
        d.experience_years,
        d.gender,
        d.work_days,
        d.rating,
        s.id AS service_id,
        s.name AS service_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN services s ON d.service_id = s.id
      WHERE u.role = 'doctor'
    `;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const getDoctorById = async (req, res) => {

    const { id } = req?.params;

    try {
        const query = `
      SELECT 
        d.id AS doctor_id,
        u.id AS user_id,
        u.name,
        u.surname,
        u.email,
        u.telephone,
        d.photo,
        d.experience_years,
        d.bachelor_degree,
        d.master_degree,
        d.gender,
        d.work_days,
        d.bio,
        d.rating,
        d.facebook_url,
        d.instagram_url,
        s.id AS service_id,
        s.name AS service_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN services s ON d.service_id = s.id
      WHERE d.user_id = ?
    `;

        db.query(query, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Doctor tapılmadı" });
            }

            res.json(results[0]);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getDoctorsByService = async (req, res) => {
    try {
        const { service_id } = req.params;
        if (!service_id) {
            return res.status(400).json({ error: "service_id tələb olunur" });
        }

        const query = `
      SELECT 
        d.id AS doctor_id,
        u.id AS user_id,
        u.name,
        u.surname,
        u.email,
        u.telephone,
        d.photo,
        d.experience_years,
        d.gender,
        d.work_days,
        d.rating,
        s.id AS service_id,
        s.name AS service_name
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      JOIN services s ON d.service_id = s.id
      WHERE d.service_id = ?
    `;

        db.query(query, [service_id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(results);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Serverdə xəta baş verdi" });
    }
};


export const updateDoctor = async (req, res) => {
    const data = req.body;

    const profile = await verifyToken(req, res);

    if (!profile?.id) {
        return res.status(400).json({ error: "user_id is required" });
    }

    // Users cədvəlinə aid sahələr
    const userFields = ['name', 'surname', 'email', 'telephone'];
    // Doctors cədvəlinə aid sahələr
    const doctorFields = ['gender', 'experience_years', 'work_days', 'service_id', "bio", "bachelor_degree", "master_degree", "instagram_url", "facebook_url"];

    // users üçün set ediləcək fieldlər və values
    const userSet = [];
    const userValues = [];

    userFields.forEach(field => {
        if (data[field] !== undefined) {
            userSet.push(`${field} = ?`);
            userValues.push(data[field]);
        }
    });

    // doctors üçün set ediləcək fieldlər və values
    const doctorSet = [];
    const doctorValues = [];

    doctorFields.forEach(field => {
        if (data[field] !== undefined) {
            doctorSet.push(`${field} = ?`);
            doctorValues.push(data[field]);
        }
    });

    // Promise-lərlə async update etmək üçün funksiyalar
    const updateUsers = () => {
        if (userSet.length === 0) return Promise.resolve();

        const query = `UPDATE users SET ${userSet.join(', ')} WHERE id = ?`;
        userValues.push(profile?.id);

        return new Promise((resolve, reject) => {
            db.query(query, userValues, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    const updateDoctors = () => {
        if (doctorSet.length === 0) return Promise.resolve();

        const query = `UPDATE doctors SET ${doctorSet.join(', ')} WHERE user_id = ?`;
        doctorValues.push(profile?.id);

        return new Promise((resolve, reject) => {
            db.query(query, doctorValues, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    };

    // Hər iki update-i paralel icra et
    Promise.all([updateUsers(), updateDoctors()])
        .then(() => {
            res.json({ message: "User and doctor info updated successfully" });
        })
        .catch(err => {
            console.error("Error updating user/doctor info:", err);
            res.status(500).json({ error: "Database error during update" });
        });
};
