const crypto = require('crypto');
const sharp = require('sharp');

exports.resizeImages = async (req, res, next) => {
	try {
		filename = `${crypto
			.randomUUID()
			.replaceAll('-', '')
			.substr(0, 5)}${Date.now()}`;

		if (req.files) {
			req.files.name = [];

			Promise.all(
				req.files.map((file, i) => {
					sharp(file.buffer)
						.resize(1000, 1000)
						.toFormat('jpeg')
						.webp({quality: 80})
						.toFile(`uploads/images/post/${filename}-${i}.jpeg`);
					req.files.name.push(`${filename}-${i}.jpeg`);
				})
			);
		}
	} catch (error) {
		res.status(500).json({
			status: 'failed',
		});
	}

	next();
};

exports.uploadImages = async (req, res) => {
	try {
		const imgesLink = [];

		req.files.name.forEach((file) => {
			imgesLink.push(
				`${req.protocol}://${req.get('host')}/uploads/images/post/${file}`
			);
		});
		res.status(200).json({
			status: 'success',
			message: 'images uploaded successfully',
			data: imgesLink,
		});
	} catch (error) {
		return Error(res, error, 500);
	}
};
