import mongoose from "mongoose";
const { Schema } = mongoose;

const beasiswaSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	instansiName: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},

	email: {
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
	category: {
		type: String,
		required: true,
	},
	date: {
		type: String,
		required: true,
	},
	update: {
		type: String,
		required: true,
	},
	expired: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},

	user: {
		type: mongoose.ObjectId,
		required: true,
		ref: "instansi",
	},
});

const Beasiswa = mongoose.model("beasiswa", beasiswaSchema);
export default Beasiswa;
