import "dotenv/config";
import { createApp } from "./App";
import Logger from "../../config/Logger";

const app = createApp();
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  Logger.info(
    `Servidor Express (challenger) escuchando en http://localhost:${PORT}`
  );
});
