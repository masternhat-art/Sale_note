const homeRouter = require('./home');
const storeRouter = require('./store');

//Gom tất cả các router từ file main vào một nơi để tiện quản lý và đăng ký vào app.
function router(app){
    // [Get] /home
    app.use('/home', homeRouter);
    // [Get] /store
    app.use('/store', storeRouter);
    // [Post] /store/add
    app.use('/store/add', storeRouter);
}


module.exports = router;
