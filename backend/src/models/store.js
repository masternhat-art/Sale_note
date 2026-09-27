const mongoose = require('mongoose');
const slugify = require('slugify');
const { calculateRestockCycle } = require('../utils/cycleCalculator');

const VALID_ZONES = [
    'Nam Từ Liêm', 'Bắc Từ Liêm', 'Cầu Giấy', 
    'Đống Đa', 'Thanh Xuân', 'Hoài Đức', 
    'Thanh Trì', 'Hà Đông', 'Hai Bà Trưng', 
    'Hoàn Kiếm', 'Hoàng Mai' , 'Chương Mỹ', 'Thanh Oai'
];

const storeSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, unique: true },
    phone: { type: [String], trim: true, maxlength: 20 },
    address: { type: String, trim: true, maxlength: 300 },
    zone: {
        type: String,
        required: true,
        enum: VALID_ZONES,
        trim: true
    },
    
    // MẢNG LƯU LỊCH SỬ (Tối đa 5 lần)
    successful_visits: { type: [Date], default: []},
    
    last_visit: {
        date: { type: Date, default: Date.now },
        status: { type: Boolean, 
            enum: [true, false], // Bắt buộc chỉ nhận 1 trong 2 giá trị này
            required: true 
        },
        note: String // (Tùy chọn) Ghi chú: ví dụ "Chủ đi vắng", "Hết tiền mặt"
    },
 
    // Chu kỳ nhập hàng (số ngày) - Sẽ được tính lại tự động mỗi khi mảng visits thay đổi
    restock_cycle: { type: Number, default: 60, min: 1, max: 365 },
    // Ngày dự kiến ghé thăm. 
    next_suggested_visit: Date 
    

}, {
    timestamps: true,
    optimisticConcurrency: true
});

// Middleware: Tự động tạo slug từ 'name' trước khi lưu vào database
storeSchema.pre('save', function() {
    // Chỉ tạo lại slug nếu trường name bị thay đổi hoặc là tạo mới
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { 
            lower: true,      // Chuyển thành chữ thường
            strict: true,     // Xóa các ký tự đặc biệt (!, @, #,...)
            locale: 'vi'      // Hỗ trợ tiếng Việt
        });
    }
    ;
});

// Tự động tính toán chu kỳ nhập hàng dựa trên lịch sử ghé thăm.
storeSchema.pre('save', function() {    
    this.restock_cycle = calculateRestockCycle(this.successful_visits);
});

//Tự động cập nhật next_suggested_visit dựa trên thời gian ghé thăm gần nhất và chu kỳ nhập hàng.
storeSchema.pre('save', function() {
    if(this.last_visit.status==true){
        this.successful_visits.push(this.last_visit.date);// Nếu thành công, cho nó vào mảng để tính chu kỳ nhập hàng
        this.next_suggested_visit = new Date(this.last_visit.date.getTime() + this.restock_cycle * 24 * 60 * 60 * 1000);
    }
    // Nếu lần ghé thăm gần nhất không thành công, đặt next_suggested_visit là 30 ngày sau lần ghé thăm đó.
    else{
        this.next_suggested_visit = new Date(this.last_visit.date.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
});

// Phục vụ truy vấn danh sách cửa hàng cần ghé, sau đó nhóm theo zone.
storeSchema.index({ next_suggested_visit: 1, zone: 1 });

// Cho phép tra cứu bằng số điện thoại nhưng vẫn cho phép cửa hàng chưa có số.
storeSchema.index({ phone: 1 }, { unique: true, sparse: true });


const Store = mongoose.model('Store', storeSchema);


module.exports = Store;
module.exports.VALID_ZONES = VALID_ZONES;
