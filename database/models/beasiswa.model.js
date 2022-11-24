import mongoose from 'mongoose';
const { Schema } = mongoose;

const beasiswaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },

    kuota: {
        type: Number,
        required: true,
    },

    image: {
        type: String,
        required: true,
    },
});

const Beasiswa = mongoose.model("beasiswa", beasiswaSchema);
export default Beasiswa;