import jwt from 'jsonwebtoken';
import passport from 'passport';

export const login = (req, res, next) => {

  // llama a passport usando la estrategia 'local'
  // { session: false } para API REST sin estado
  passport.authenticate('local', { session: false }, (err, user, info) => {

    // Si hubo un error interno
    if (err) {
      console.error("Error interno en autenticación:", err);
      return res.status(500).json({ message: "Error interno del servidor" });
    }

    // Fallo de credenciales (usuario no encontrado, contraseña incorrecta o usuario inactivo)
    if (!user) {
      return res.status(401).json({ message: info.message || "No autorizado" });
    }

    // Si todo salió bien, hay JWT
    const payload = {
      id_usuario: user.id
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    return res.status(200).json({
      message: "Login exitoso",
      token: token,
      usuario: user
    });

  })(req, res, next);
};
