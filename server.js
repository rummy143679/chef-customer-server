const app = require("./index");
require("dotenv").config();
const dbConnection = require('./DbConnevtion/db');

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//     console.log(`Server running on ${PORT}`);
// });

const startServer = async() => {
    await dbConnection();
    // mongoose.connect("mongodb+srv://chefdbuser:chefdbuser@cluster0.2vhygf3.mongodb.net/?appName=Cluster0")
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`✅ Server running on port ${port}`));
};

startServer();