import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { authService } from '../services/auth.service.js';
import dotenv from 'dotenv';

dotenv.config();

// ESTRATEGIA LOCAL: como se validan los ususarios
passport.use(
  new LocalStrategy(
    {
        usernameField: 'usuario',
        passwordField: 'contrasenia'
    },
    async (usuario, contrasenia, done) => {
        try {
        // Armamos un objeto que simula el 'body' de la petición para que
        // el servicio y el DTO lo puedan procesar correctamente.
        const user = await authService.login({ usuario, contrasenia });

        // Si la función devuelve null (no existe, clave errónea o inactivo)
        if (!user) {
            // fallo de la autenticación
            return done(null, false, { message: 'Usuario o contraseña incorrectos' });
        }
        
        return done(null, user); //

        } catch (error) {
            console.error("Error en LocalStrategy:", error);
            return done(error);
        }
    }
  )
);

//ESTRATEGIA JWT (para proteger el resto de las rutas - verificación Activa)
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
      try {
        // extrae el ID del token y se lo pasa al servicio para ver si el usuario sigue existiendo
        const user = await authService.getById(jwtPayload.id_usuario);
        
        if (user) {
            // el usuario existe y está activo
            return done(null, user);
        } else {
            // el token tiene firma válida, pero el usuario fue borrado o desactivado
            return done(null, false, { message: 'Token inválido o usuario no encontrado.' });
        }
      } catch (error) {
        console.error("Error en JwtStrategy:", error);
        return done(error, false);
      }
    }
    )
);
export default passport;