import { db } from "../index.js";

export const getNews = async (req, res) => {
    try {
        const query = `
            SELECT 
                *
            FROM news
        `;
        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) return res.status(400).json({ error: 'Xəbər ID-si göndərilməyib.' });

        const query = `
            SELECT * FROM news WHERE id = ?
        `;

        db.query(query, [id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length === 0) {
                return res.status(404).json({ error: 'Xəbər tapılmadı.' });
            }

            res.json(results[0]);
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};
