const Store = require('../models/store');

async function getDailyRoute() {

    
    const today = new Date();
    const sevenDayAgo = new Date(today);
    sevenDayAgo.setDate(today.getDate() - 7);
    const routes = await Store.aggregate([
            // Bước 1 ($match): Lọc ra những cửa hàng ĐÃ ĐẾN HẠN hoặc QUÁ HẠN
            {
                $match: {
                    next_suggested_visit: { $lte: today }
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
                            overdue_date: "$next_suggested_visit"
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

module.exports = getDailyRoute;

