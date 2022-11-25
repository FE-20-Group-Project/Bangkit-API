import mongoose from 'mongoose';
const { Schema } = mongoose;

const artikelSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },

    publish_date: {
        type: Date,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },
});

const Artikel = mongoose.model("artikel", artikelSchema);
export default Artikel;