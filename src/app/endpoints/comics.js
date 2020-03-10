const conn = require('../../config/mysql');
const Joi = require('joi');

module.exports = (app) => {
    //Endpoint para obtener todos los comics
    app.get('/comic', (req, res) => {
        let query = "SELECT id, nombre, editorial FROM comic";
        conn.query(query, (err, rows, fields) => {
            if (err) res.status(500).send("error en el query");
            res.send(rows);
        });
    } );
    //Endpoint para obtener un comic en particular en base al id
    app.get('/comic/:id', (req, res) => {
        let query = `SELECT id, nombre, editorial FROM comic WHERE id = ${req.params.id}`;
        conn.query(query, (err, rows, field) => {
            if (err) res.status(500).send("No se encontro el campo");
            if (rows) {
              res.send(rows[0]);
            }
            res.send('{"mensaje":"No se encontro el id"}');
        });
    });
    //Ingresar un comic a la base de datos
    app.post('/comic', (req, res) => {
        let schema = Joi.object({
            nombre: Joi.string().required(),
            editorial: Joi.string().required()
        });
        let valid = schema.validate(req.body);
        if (valid.error) res.status(400).send('{"mensaje":"sintaxis invalida"}');

        let query = `INSERT INTO comic (nombre, editorial) VALUES ('${req.body.nombre}', '${req.body.editorial}')`;
        conn.query(query, (err, rows, fields) => {
            if (err) res.status(500).send('{"mensaje":"Error"}');
            res.send(req.body);
        });
    });
    //Update un comic
    app.put('/comic/:id', (req, res) => {
        let schema = Joi.object({
            nombre: Joi.string().required(),
            editorial: Joi.string().required()
        });
        if (schema.validate(req.body).error) res.status(400).send("Error en los parametros enviados");
        let query = `UPDATE comic SET nombre = '${req.body.nombre}', editorial = '${req.body.editorial}' WHERE id = ${req.params.id}`;
        conn.query(query, (err, row, col) => {
            if (err) res.status(500).send("Error en el query");
            res.send('{"mensaje":"Actualizacion realizada"}');
        }); 
    });

    app.delete('/comic/:id', (req, res) => {
        let query = `DELETE FROM comic WHERE id = ${req.params.id}`;
        conn.query(query, (err, row, col) => {
            if (err) res.status(400).send("No se pudo borrar el comic");
            res.send("Comic eliminado satisfactoriamente");
        })
    }) 
}
