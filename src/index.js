const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize } = require("./models");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["https://test-frontend-murex-omega.vercel.app/", "http://localhost:5173"], credentials: true }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tests", require("./routes/testRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.get("/", (req, res) => res.send("test"));

app.get('/test-route', (req, res) => {
  res.json({ msg: 'Маршруты работают' });
});

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log(`Сервер на порту http://localhost:${PORT}/`));
  })
  .catch((err) => console.error("Ошибка с подключением к бд:", err));
