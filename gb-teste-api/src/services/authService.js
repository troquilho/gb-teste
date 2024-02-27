import bcrypt from 'bcryptjs';

const login = async (username, password, fastify) => {
    const passwordMatch = await bcrypt.compare(password, process.env.NODE_PASSWORD_ENCRYPTED);
    if (username === process.env.NODE_USER && passwordMatch) {
        const expiration = new Date().setHours(new Date().getHours() + 4);
        let tokenObj = { username, expiration };
        const token = fastify.jwt.sign({ tokenObj }, { expiresIn: '4h' });
        return token;
    } else {
        throw new Error("Usuário ou senha inválidos");
    }
};

export default { login };