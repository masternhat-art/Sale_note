const mongoose = require('mongoose');
const { calculateRestockCycle } = require('../utils/cycleCalculator');

const VALID_ZONES = [
    'Nam Từ Liêm', 'Bắc Từ Liêm', 'Cầu Giấy', 
    'Đống Đa', 'Thanh Xuân', 'Hoài Đức', 
    'Thanh Trì', 'Hà Đông', 'Hai Bà Trưng', 
    'Hoàn Kiếm', 'Hoàng Mai' , 'Chương Mỹ', 'Thanh Oai'
];

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 20 },
    address: { type: String, trim: true, maxlength: 300 },
    zone: {
        type: String,
        required: true,
        enum: VALID_ZONES,
        trim: true
    },
    
    // MẢNG LƯU LỊCH SỬ (Tối đa 5 lần)
    succesfull_visits: { type: [Date], default: [] }, 
    
    // Chu kỳ nhập hàng (số ngày) - Sẽ được tính lại tự động mỗi khi mảng visits thay đổi
    restock_cycle: { type: Number, default: 60, min: 1, max: 365 },
    // Ngày dự kiến ghé thăm. 
    next_suggested_visit: Date 

}, {
    timestamps: true,
    optimisticConcurrency: true
});

// Tự động tính toán chu kỳ nhập hàng dựa trên lịch sử ghé thăm.
storeSchema.pre('save', function() {    
    this.restock_cycle = calculateRestockCycle(this.succesfull_visits);
});

//Tự động cập nhật next_suggested_visit dựa trên thời gian ghé thăm gần nhất và chu kỳ nhập hàng.
storeSchema.pre('save', function() {
    if (this.succesfull_visits.length > 0) {
        const lastVisit = this.succesfull_visits[this.succesfull_visits.length - 1];
        this.next_suggested_visit = new Date(lastVisit.getTime() + this.restock_cycle * 24 * 60 * 60 * 1000);
    } else {
        this.next_suggested_visit = null;
    }
});

// Phục vụ truy vấn danh sách cửa hàng cần ghé, sau đó nhóm theo zone.
storeSchema.index({ next_suggested_visit: 1, zone: 1 });

// Cho phép tra cứu bằng số điện thoại nhưng vẫn cho phép cửa hàng chưa có số.
storeSchema.index({ phone: 1 }, { unique: true, sparse: true });


const Store = mongoose.model('Store', storeSchema);


module.exports = Store;
module.exports.VALID_ZONES = VALID_ZONES;
