const Store = require('../models/store');
// Add store
class StoreController {
    //[GET] /store
    show(req, res, next) {
        Store.find()
            .then(stores => res.json(stores))
            .catch(next);
    }

    //[POST] /store/add
    add(req, res, next) {
        const today = new Date();
        const { name, phone, address, zone, succesfull_visits } = req.body;
        if (succesfull_visits== null || succesfull_visits.length === 0|| succesfull_visits === undefined) {
            succesfull_visits.push(today); // Nếu mảng rỗng, thêm ngày hiện tại vào mảng succesfull_visits
        }
        const store = new Store({ name, phone, address, zone, succesfull_visits });
        store.save()
            .then(() => res.status(201).json(store))
            .catch(next);
    }

    //[Patch]/store/:phone/edit
    edit(req, res, next) {

    }
}

module.exports = new StoreController();
