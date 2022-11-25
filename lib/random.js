const pool = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

const randomText = (length) => {
	const result = [];
	for (let i = 0; i < length; i++) result.push(pool[Math.floor(Math.random() * pool.length)]);
	return result.join("");
};

export { randomText };
