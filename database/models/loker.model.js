import mongoose from "mongoose";
const { Schema } = mongoose;

const lokerSchema = new Schema({
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
	image: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.ObjectId,
		required: true,
		ref: "instansi",
	},
});

const Loker = mongoose.model("Loker", lokerSchema);
export default Loker;