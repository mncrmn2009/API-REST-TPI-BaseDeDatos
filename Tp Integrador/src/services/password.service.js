import bcrypt from "bcrypt";

/**
 * Hashea una contraseña con bcrypt
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<string>} - Contraseña encriptada
 */

export const hashPassword = async (password) => {
    const saltRounds = 10; //Cuantas veces mezcla el hash internamente, como rondas.
    return await bcrypt.hash(password,saltRounds)
};

/**
 * Compara una contraseña ingresada con el hash guardado
 * @param {string} passwordIngresada - Contraseña del usuario
 * @param {string} passwordGuardada - Hash almacenado en la BD
 * @returns {Promise<boolean>}
 */

export const verificarPassword = async (passwordPlano, hashGuardado) => {
  return await bcrypt.compare(passwordPlano, hashGuardado);
};
