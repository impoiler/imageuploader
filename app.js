const express = require('express');
const app = express();
app.use(express.json());
const {storage} = require('./storage');
const path = require('path');
const multer = require('multer');
const {resizeImages, uploadImages} = require('./editOprations/editactions');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({
	storage: storage,
});

app.get('/', (_req, res) => {
	res.status(200).json({
		status: 'success',
		message: 'server is running fine',
	});
});

app.post('/upload', upload.array(), resizeImages, uploadImages);

app.use('/', (req, res) => {
	res.status(404).json({
		status: 'failed',
		message: `${req.originalUrl} is not found in this server`,
	});
});

module.exports = app;
