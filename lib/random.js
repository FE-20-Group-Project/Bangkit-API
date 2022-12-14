import axios from "axios";
import path from "path";

const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

const randomText = (length) => {
	const result = [];
	for (let i = 0; i < length; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
	return result.join("");
};

const downloadAxios = (url) => {
	return new Promise((resolve, reject) => {
		axios
			.get(url, {
				responseType: "arraybuffer",
			})
			.then((response) => {
				resolve(response);
			})
			.catch((err) => {
				console.error(err);
				reject(err);
			});
	});
};

function getExt(str) {
	const basename = path.basename(str);
	const firstDot = basename.indexOf(".");
	const lastDot = basename.lastIndexOf(".");
	const extname = path.extname(basename).replace(/(\.[a-z0-9]+).*/i, "$1");

	if (firstDot === lastDot) {
		return extname;
	}

	return basename.slice(firstDot, lastDot) + extname;
}

export { randomText, downloadAxios, getExt };
