import mongoose, {Schema} from 'mongoose';

const subDetails = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: false},
    options: {type: [String], required: false},
})
const CategorySchema = new Schema({
    title: {type: String, required: true, unique: true},
    icon: {type: String, required: false, default: null},
    slug: {type: String, required: false, default: ''},
    description: {type: String, required: false, default: ''},
    seoWords: {type: [String], required: false, default: []},
    isActive: {type: Boolean, default: false},
    subDetails: {type: [subDetails], required: false, default: []},

    otherOptions: {type: [String], default: [], required: false},

}, {timestamps: true})

const CategoryModel = mongoose.model('Category', CategorySchema);
export default CategoryModel;