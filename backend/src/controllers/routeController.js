const Store = require('../models/store');

async function getDailyRoute() {
    // Lấy các cửa hàng có lịch hẹn trong khoảng 10 ngày trước đến 10 ngày sau hôm nay.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitWindowStart = new Date(today);
    visitWindowStart.setDate(visitWindowStart.getDate() - 10);
    const visitWindowEnd = new Date(today);
    visitWindowEnd.setDate(visitWindowEnd.getDate() + 11);
    const routes = await Store.aggregate([
            // Bước 1 ($match): Lọc lịch hẹn nằm trong khoảng ±10 ngày quanh hôm nay.
            {
                $match: {
                    next_suggested_visit: {
                        $gte: visitWindowStart,
                        $lt: visitWindowEnd
                    }
                }
            },
            
            // Bước 2 ($group): Gom nhóm những cửa hàng vừa lọc được theo Khu vực (zone)
           {
                $group: {
                    _id: "$zone",                 // Tiêu chí gom nhóm là trường 'zone'
                    storeCount: { $sum: 1 },      // Cứ có 1 cửa hàng thì cộng 1 vào biến đếm
                    
                    // Gói thông tin của các cửa hàng trong nhóm này vào một mảng
                    storeList: { 
                        $push: {
                            name: "$name",
                            phone:"$phone",
                            address: "$address",
                            suggested_visit: "$next_suggested_visit"
                        }
                    }
                }
            },
            
            // Bước 3 ($sort): Sắp xếp các khu vực theo số lượng cửa hàng giảm dần (-1)
            // Tuyến nào nhiều khách chờ nhất sẽ nổi lên trên cùng
            {
                $sort: { storeCount: -1 }
            }
    ]);
    return routes;
}

class routeController {
    async getWay(req, res, next) {

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

module.exports = new routeController();