const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
module.exports = function (adminOnly = false) {
    return async function (req, res, next) {
        const { token } = req.cookies;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                if (decoded) {
                    const user = await UserModel.findById(decoded.id);

                    if (user === null) {
                        return res.status(401).json({
                            message: 'Unathorized',
                        });
                    } else {
                        if (adminOnly && user.role !== 'admin')
                            return res.status(401).json({
                                message: 'Unathorized',
                            });
                        req.user = user;
                        return next();
                    }
                } else {
                    return res.status(401).send(null);
                }
            } catch (e) {
                next(e);
            }
        }

        return res.status(401).json({
            message: 'Unathorized',
        });
    };
};
