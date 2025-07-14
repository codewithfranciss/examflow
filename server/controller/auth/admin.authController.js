const {loginAdminService} = require("../../services/auth/admin.service")

const loginAdminController = async (req, res) => {
    const {email, password} = req.body

    try{
        const admin = await loginAdminService(email, password);
        res.status(200).json({
            message: "Admin logged in successfully",
            admin
        });
    }catch(err){
        res.status(401).json({
            message: err.message,
    })
}

}

module.exports = {loginAdminController}  