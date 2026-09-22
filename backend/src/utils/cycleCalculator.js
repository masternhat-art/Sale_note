/** 
 @param {Array<Date>} visitsArray
 @return {Number}
*/

function calculateRestockCycle(visitsArray) {
    // Nếu chưa có lịch sử hoặc mới giao 1 lần
    // Trả về 30 ngày
    if ((visitsArray?.length ?? 0) < 2) {
        return 90; 
    }

    // Sắp xếp mảng tăng dần theo thời gian (từ cũ đến mới) để đảm bảo tính toán đúng
    const sortedVisits = visitsArray.map(date => new Date(date)).sort((a, b) => a - b);

    let totalDays = 0;
    const intervalsCount = sortedVisits.length - 1;

    // Vòng lặp tính khoảng cách giữa ngày sau và ngày trước
    for (let i = 1; i < sortedVisits.length; i++) {
        const timeDiff = sortedVisits[i].getTime() - sortedVisits[i - 1].getTime();
        
        // Chuyển đổi mili-giây (milliseconds) sang số ngày
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24); 
        
        totalDays += daysDiff;
    }

    // Tính trung bình cộng và làm tròn đến số nguyên gần nhất
    const averageCycle = Math.round(totalDays / intervalsCount);
    
    return averageCycle;
}

module.exports = { calculateRestockCycle };
