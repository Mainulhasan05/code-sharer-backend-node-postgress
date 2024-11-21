const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    return res.json({
        message: "Hello From Docker"
    })
})

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:5000`);
})