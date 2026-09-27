const routeRouter = require('./route');
const storeRouter = require('./store');

//Gom tất cả các router từ file main vào một nơi để tiện quản lý và đăng ký vào app.
function router(app){
    // [Get] /route
    app.use('/route', routeRouter);


    
    // [Get] /store
    app.use('/store', storeRouter);
    // [Post] /store/add
    app.use('/store/add', storeRouter);
    // [Put] /store/:slug
    app.use('/store/:slug', storeRouter);
    // [Delete] /store/:slug
    app.use('/store/:slug', storeRouter);
}


module.exports = router;
