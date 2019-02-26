import mongoose from 'mongoose';
const Schema = mongoose.Schema;
let Item = new Schema({
    item: {
        type: String
    },
    description: {
        type: String
    },
    price: {
        type: String
    },
    discount: {
        type: String,
    }
});
export default mongoose.model('Item', Item);