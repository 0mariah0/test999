const Roles = require('../_helpers/enum').roles;
const db = require('../db');

module.exports = {
    authenticate,
    deleteRefreshToken,
    updateRefreshToken,
    isValidRefreshToken
};

async function authenticate(email, password) {
    const users = await db
        .get()
        .collection('users')
        .find({
            email: email,
            password: password
        })
        .toArray();
    if (users.length >= 1) {
        const user = users[0];
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
}

async function deleteRefreshToken(token, userId) {
    if (userId)
        await db.get().collection('refresh_tokens').deleteMany({ userId: userId.toString() });
    else if (token)
        await db.get().collection('refresh_tokens').deleteOne({ refresh_token: token });
}

async function updateRefreshToken(userId, old_token, new_token) {
    await deleteRefreshToken(old_token, userId);
    await db.get().collection('refresh_tokens').insertOne({ userId: userId.toString(), refresh_token: new_token });
}

async function isValidRefreshToken(userId, refresh_token) {
    const userToken = await db.get().collection('refresh_tokens').findOne({ userId: userId, refresh_token: refresh_token });
    if (!userToken) return false;
    return true;
}
