import axios from "axios";
import formData from "form-data";
import fs from "fs";

async function editUser(id) {
	return new Promise(async (resolve, reject) => {
		const buffer = fs.readFileSync("./public/profile/none.png");
		let form = new formData();
		// form.append("file", buffer);
		form.append("name", "ini dari name form 2");

		// let data = {
		// 	name: "ini body biasa dari axios",
		// };
		axios({
			url: `https://api-bangkit.up.railway.app/api/user/edit/${id}`,
			method: "PUT",
			headers: {
				authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzgwZTFkYjhlMWRmZTRlY2NiZTRlODUiLCJpYXQiOjE2Njk1NDMyOTMsImV4cCI6MTY3MDE0ODA5M30._pzdRi-_PDE85rvHNWetE-i6n-Qv24sVVParoXyPNDE`,
			},
			data: form,
			// data,
		})
			.then(({ data }) => {
				resolve(data);
			})
			.catch((err) => reject(err));
	});
}

editUser("6380e1db8e1dfe4eccbe4e85").then(console.log).catch(console.log());
