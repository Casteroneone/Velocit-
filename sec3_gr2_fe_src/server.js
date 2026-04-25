const express = require('express');
const path    = require('path');
const app     = express();

// Serve all static files from this folder
app.use(express.static(path.join(__dirname)));

// Root → redirect so relative CSS/JS paths resolve correctly
app.get('/', (req, res) => {
    res.redirect('/Homepage/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Velocita frontend running at http://localhost:${PORT}`);
});
