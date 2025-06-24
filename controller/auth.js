import { db } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/middleware.js";

const JWT_SECRET = process.env.JWT_SECRET || "menim_gizli_tokenim"

export const register = async (req, res) => {
  try {
    const { name, email, surname, password, role, telephone, specialty, service_id } = req.body;

    if (!name || !email || !password || !telephone) {
      return res.status(400).json({ message: "Zəhmət olmasa bütün xanaları doldurun." });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Serverdə xəta baş verdi." });
      }

      if (result.length > 0) {
        return res.status(409).json({ message: "Bu email ilə artıq qeydiyyat mövcuddur." });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      db.query(
        'INSERT INTO users (name, surname, email, password, role, telephone) VALUES (?, ?, ?, ?, ?, ?)',
        [name, surname, email, hashedPassword, role || 'patient', telephone],
        (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ message: "İstifadəçi qeydiyyatdan keçə bilmədi." });
          }

          const userId = result.insertId;

          if (role === 'doctor') {
            db.query(
              'INSERT INTO doctors (user_id) VALUES (?)',
              [userId],
              (err) => {
                if (err) {
                  console.log(err);
                  return res.status(500).json({ message: "Həkim məlumatları əlavə edilə bilmədi." });
                }

                const user = {
                  id: userId,
                  name,
                  surname,
                  email,
                  role: role || 'patient',
                };

                const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

                res.status(201).json({
                  message: "Həkim uğurla qeydiyyatdan keçdi.",
                  token,
                  user
                });
              }
            );
          } else {
            // Rol doctor deyil, adi istifadəçi kimi cavab ver
            const user = {
              id: userId,
              name,
              surname,
              email,
              role: role || 'patient',
            };

            const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
              message: "İstifadəçi uğurla qeydiyyatdan keçdi.",
              token,
              user
            });
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gözlənilməz bir xəta baş verdi.", error: error.message });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Zəhmət olmasa bütün xanaları doldurun." });
    }

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (err, result) => {

      if (err) {

        return res.status(500).json({ message: "Serverdə xəta baş verdi." });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Email və ya şifrə yanlışdır." });
      }

      const user = result[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Email və ya şifrə yanlışdır." });
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      res.status(200).json({
        message: "Giriş uğurla tamamlandı.",
        token,
        user: payload
      });
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Gözlənilməz bir xəta baş verdi.", error: error.message });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const profile = await verifyToken(req, res);
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};