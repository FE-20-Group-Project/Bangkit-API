import mongoose from "mongoose";
const { Schema } = mongoose;

const lokerSchema = new Schema({
	companyName: {
		type: String,
		required: true,
	},
	positionName: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	email: {
		type: String,
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
	location: {
		type: String,
		required: true,
	},
	salary: {
		type: String,
		required: true,
	},
	qualification: {
		type: String,
		required: true,
	},
	workType: {
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

const Loker = mongoose.model("Loker", lokerSchema);
export default Loker;
