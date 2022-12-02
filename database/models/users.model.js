import mongoose, { Schema } from "mongoose";

const UsersSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			unique: true,
			required: true,
		},
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
		contact: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		isBlocked: {
			type: Boolean,
			required: true,
		},
	},
	{ versionKey: false }
);

const Users = mongoose.model("user", UsersSchema);
export default Users;
