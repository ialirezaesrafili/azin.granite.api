import mongoose, {Schema, Types} from 'mongoose';

const propertiesDetail = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
});

const ProductSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    code: {type: String, required: false, default: null},
    category: {type: Types.ObjectId, ref: 'Category', required: true, default: ''},
    slug: {type: String, required: false, default: ''},
    size: {type: Number, required: false, default: 0},
    properties: {type: [propertiesDetail], required: false, default: []},
    seoWords: {type: [String], required: false, default: []},
    image: {type: String, required: false, default: ''},
    isActive: {type: Boolean, default: false},
    colors: {type: [String], required: true, default: []}
})

const ProductModel = mongoose.model('Product', ProductSchema);

export default ProductModel;
