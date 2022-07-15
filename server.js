const express = require("express");
const connectDB = require("./db");
const app = express();
const cookieParser = require("cookie-parser");
const {adminAuth, userAuth} = require("./middleware/authentic")


const PORT = 5000
const server = app.listen(PORT, () => console.log(`Server connected to port ${PORT}`))
process.on("unhandledRejection", (err) => {
    console.log(`An error occured: ${err.message}`);
    server.close(() => process.exit(1))
})
connectDB();

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", require("./Auth/route"))
app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/bssic", userAuth, (req, res) => res.send("User Route"));

