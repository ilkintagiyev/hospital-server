import { db } from "../index.js";

export const getServices = async (req, res) => {
    try {
        const query = 'SELECT * FROM services';
        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const getServiceById = async (req, res) => {
    const { id } = req.params;


    try {
        const serviceQuery = `SELECT * FROM services WHERE id = ?`;
        db.query(serviceQuery, [id], (err, serviceResults) => {
            if (err) return res.status(500).json({ error: err.message });

            if (serviceResults.length === 0) {
                return res.status(404).json({ error: 'Service not found' });
            }

            const service = serviceResults[0];

            // Həkimləri al
            const doctorsQuery =
                `SELECT doctors.id, doctors.photo, users.name, users.surname 
  FROM doctors 
  JOIN users ON doctors.user_id = users.id 
  WHERE doctors.service_id = ?`
                ;
            db.query(doctorsQuery, [id], (err, doctorResults) => {
                if (err) return res.status(500).json({ error: err.message });
                // Şəkilləri al
                const imagesQuery = `SELECT id, image_url, alt_text FROM images WHERE service_id = ?`;
                db.query(imagesQuery, [id], (err, imageResults) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({ error: err.message })
                    }

                    res.json({
                        service,
                        doctors: doctorResults,
                        images: imageResults
                    });
                });
            });
        });
    } catch (error) {

        res.status(500).json({ error: 'Server error' });
    }
};
