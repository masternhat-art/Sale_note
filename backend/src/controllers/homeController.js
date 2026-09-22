const getDailyRoute = require('./routeController');

class HomeController {
    async getDailyRoute(req, res, next) {
        try {
            const data = await getDailyRoute();
            res.status(200).json({
                data,
                message: 'Lấy danh sách cửa hàng cần ghé thăm trong ngày thành công!'
            });
        } catch (error) {
            next(error);
        }
    }    
}

module.exports= new HomeController();
