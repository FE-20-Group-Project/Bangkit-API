import mongoose, { Schema } from "mongoose";

const LaporanSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.ObjectId,
			required: true,
			ref: "user",
		},
		title: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		subcategory: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		total_view: {
			type: Number,
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
		status: {
			type: String,
			required: true,
		},
		expired: {
			type: String,
			required: true,
		},
		reply: [
			{
				user: { type: mongoose.ObjectId, required: true },
				content: { type: String, required: true },
				date: { type: String, required: true },
				update: { type: String, required: true },
			},
		],
	},
	{ versionKey: false }
);

const Laporan = mongoose.model("laporan", LaporanSchema);
export default Laporan;
