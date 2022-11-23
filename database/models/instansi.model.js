import mongoose from "mongoose";

const InstansiSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
	},
	{ versionKey: false }
);

const Instansi = mongoose.model("instansi", InstansiSchema);
export default Instansi;
