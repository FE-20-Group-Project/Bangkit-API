import mongoose from "mongoose";

const AdminsSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		type: {
			type: String,
			required: true,
		},
	},
	{ versionKey: false }
);

const Admins = mongoose.model("admin", AdminsSchema);
export default Admins;
