require('dotenv').config();
const express = require('express');
const path = require('path');
const translationRoutes = require('./src/api/routes/translation.routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', translationRoutes);

app.listen(PORT, () => {
  console.log(`[API] Servidor (Polling) rodando em http://localhost:${PORT}`);
});