import mongoose, {Schema} from 'mongoose';


const CategorySchema = new Schema({
    title: {type: String, required: true, unique: true},
    icon: {type: String, required: false, default: null},
    slug: {type: String, required: false, default: ''},
    description: {type: String, required: false, default: ''},
    seoWords: {type: [String], required: false, default: []},
    isActive: {type: Boolean, default: false},
})

const CategoryModel = mongoose.model('Category', CategorySchema);
export default CategoryModel;