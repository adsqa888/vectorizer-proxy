const express = require('express');
const cors = require('cors');
const FormData = require('form-data');
const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());

app.get('/', (_, res) => {
  res.send('✅ Vectorizer Proxy работает');
});

app.post('/vectorize', upload.single('image'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path));

    const response = await axios.post('https://vectorizer.ai/api/v1/vectorize', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: 'Basic dms2NWVuemJleXk0d3ZrOnBqZW9udTk5aXY5cWVtOWZtcmRiZHU4bG83bWE1djdudmwycWIwZjFlNmpucm5uZzJmcWc='
      }
    });

    res.set('Content-Type', 'image/svg+xml');
    res.send(response.data);
    fs.unlinkSync(req.file.path);
  } catch (err) {
    console.error('Ошибка запроса к vectorizer.ai:');
    if (err.response) {
      console.error('Код:', err.response.status);
      console.error('Ответ:', err.response.data);
    } else {
      console.error('Ошибка:', err.message);
    }
    res.status(500).send('Ошибка векторизации');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔄 Сервер запущен на http://localhost:${PORT}`));
