import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import Item from './models/Item';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/listitems');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

router.route('/listitems').get((req, res) => {
    Item.find((err, listitems) => {
        if (err)
            console.log(err);
        else
            res.json(listitems);
    });
});

router.route('/listitems/:id').get((req, res) => {
    Item.findById(req.params.id, (err, listitems) => {
        if (err)
            console.log(err);
        else
            res.json(listitems);
    });
});

router.route('/listitems/add').post((req, res) => {
    let item = new Item(req.body);
    item.save()
        .then(item => {
            res.status(200).json({'item': 'Added successfully'});
        })
        .catch(err => {
            res.status(400).send('Failed to create new record');
        });
});

router.route('/listitems/update/:id').post((req, res) => {
    Item.findById(req.params.id, (err, listitems) => {
        if (!listitems)
            return next(new Error('Could not load document'));
        else {
            listitems.item = req.body.item;
            listitems.description = req.body.description;
            listitems.price = req.body.price;
            listitems.discount = req.body.discount;

            listitems.save().then(listitems => {
                res.json('Update done');
            }).catch(err => {
                res.status(400).send('Update failed');
            });
        }
    });
});

router.route('/listitems/delete/:id').get((req, res) => {
    Item.findByIdAndRemove({_id: req.params.id}, (err, listitems) => {
        if (err)
            res.json(err);
        else
            res.json('Remove successfully');
    })
})

app.use('/', router);

app.listen(4000, () => console.log('Express server running on port 4000'));