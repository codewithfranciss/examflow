const prisma = require('../../config/db');
const bcrypt = require("bcrypt")

const loginAdminService = async (email, password) => {
    const admin = await prisma.admin.findUnique({
        where: {email}
    })
    if(!admin) {
        throw new Error('Admin email not found')
    }
    const isMatch = await bcrypt.compare(password, admin.password)

    if(!isMatch){
        throw new Error('Password is incorrect');
    }
    return {id: admin.id, email: admin.email}
}

module.exports = loginAdminService;