import app from "./app.js";

// ~ Start the server
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${
        process.env.PORT || 3000
    }`);
});
