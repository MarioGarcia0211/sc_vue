import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado o inválido' });
  }

  try {
    const jwtToken = token.split(' ')[1];
    const decoded = jwt.verify(jwtToken, process.env.TOKEN_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};