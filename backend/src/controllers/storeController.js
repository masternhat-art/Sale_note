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
        const { name, phone, address, zone, last_visit, successful_visits } = req.body;
        const store = new Store({ name, phone, address, zone, last_visit, successful_visits });
        store.save()
            .then(() => res.status(201).json(store))
            .catch(next);
    }

    //[Patch]/store/:phone/edit
    edit(req, res, next) {
        
    }
}

module.exports = new StoreController();
