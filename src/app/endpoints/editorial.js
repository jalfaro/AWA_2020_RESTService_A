module.exports = app => {
    app.get("/editorial", (req, res) {
        res.send("Hola mundo");
    });
}