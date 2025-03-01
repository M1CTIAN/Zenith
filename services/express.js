const express = require('express');

module.exports = (client) => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.get('/', (req, res) => {
        res.send('Hello World');
    });

    app.listen(PORT, () => {
        console.log(`Web server running on port ${PORT}`);
    });

    return app;
};