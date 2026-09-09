import 'dotenv/config';
import express from 'express';
import { registerAdminApiRoutes } from './admin-api';

const app = express();

app.use(express.json());
registerAdminApiRoutes(app);

const port = Number(process.env['ADMIN_API_PORT'] ?? 4300);

app.listen(port, () => {
  console.log(`Explora admin API listening on http://localhost:${port}`);
});