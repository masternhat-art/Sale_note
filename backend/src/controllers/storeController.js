const Store = require('../models/store');
const slugify = require('slugify');
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

    //[PUT]/store/:slug/edit
    edit(req, res, next) {
        const { slug } = req.params;
        const allowedFields = ['name', 'address', 'zone', 'last_visit','phone'];
        const updateData = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        }

        if (updateData.name) {
            updateData.slug = slugify(updateData.name, { lower: true, strict: true, locale: 'vi' });
        }

        Store.findOneAndUpdate({ slug }, updateData, { new: true, runValidators: true })
            .then(store => {
                if (!store) return res.status(404).json({ message: 'Store not found' });
                res.json(store);
            })
            .catch(err => {
                if (err.code === 11000) {
                    return res.status(409).json({ message: 'Tên cửa hàng đã tồn tại' });
                }
                next(err);
            });
    }

    //[Delete] /store/:slug/delete
    delete(req, res, next) {
        const { slug } = req.params;
        Store.findOneAndDelete({ slug })
            .then(store => {
                if (!store) {
                    return res.status(404).json({ message: 'Store not found' });
                }
                res.json({ message: 'Store deleted successfully' });
            })
            .catch(next);
    }
}

module.exports = new StoreController();
