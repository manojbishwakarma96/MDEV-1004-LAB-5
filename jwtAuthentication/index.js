const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const routes = require("./routes/routes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
