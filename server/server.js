const express = require('express')
const cors = require('cors')
const connection = require('./connection')

const app = express()

app.use(cors())
app.use(express.json())


// @url: localhost:3030/add
// @method: POST
// @function: add a new todo
app.post('/add', (req, res) => {
    const { name, start, end, priority } = req.body;

    connection.query(
        'INSERT INTO todo (name, start, end, priority) VALUES (?, ?, ?, ?)',
        [name, start, end, priority],
        err => {
            if (err) {
                console.log("[INSERT ERROR] - ", err.message);
                return res.status(500).json({ code: 500, message: 'error' });
            }
            res.status(200).json({ code: 200, message: 'success' });
        }
    );
});

// @url: localhost:3030/
// @method: GET
// @function: get all todos
app.get('/', (req, res) => {
    connection.query(
        `select * from todo where is_deleted = 0`,
        (err, result) => {
            if (err) {
                console.log("[SELECT ERROR] - ", err.message)
                return
            }
            res.status(200).json(result)
        }
    )
})

// @url: localhost:3030/done
// @method: GET
// @function: get all dones
app.get('/done', (req, res) => {
    connection.query(
        `select * from todo where is_deleted = 1`,
        (err, result) => {
            if (err) {
                console.log("[SELECT ERROR] - ", err.message)
                return
            }
            res.status(200).json(result)
        }
    )
})

// @url: localhost:3030/delete/:id
// @method: POST
// @function: change a todo to done(by setting its is_deleted)
app.post('/delete/:id', (req, res) => {
    connection.query(
        `update todo set is_deleted = 1 where id = ${req.params.id}`,
        err => {
            if (err) {
                console.log("[UPDATE ERROR] - ", err.message)
                return
            }
            res.status(200).json({ code: 200, message: 'success'})
        }
    )
})

// @url: localhost:3030/delete-todo/:id
// @method: DELETE
// @function: delete a todo with specified id
app.delete('/delete-todo/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'DELETE FROM todo WHERE id = ?',
        [id],
        (err, result) => {
            if (err) {
                console.log("[DELETE ERROR] - ", err.message);
                return res.status(500).json({ code: 500, message: 'error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ code: 404, message: 'Todo not found' });
            }

            res.status(200).json({ code: 200, message: 'success' });
        }
    );
});

// @url: localhost:3030/completed/:id
// @method: DELETE
// @function: delete a completed todo
app.delete('/completed/:id', (req, res) => {
    const id = req.params.id;

    connection.query(
        'DELETE FROM todo WHERE id = ? AND is_deleted = 1',
        [id],
        (err, result) => {
            if (err) {
                console.log("[DELETE ERROR] - ", err.message);
                return res.status(500).json({ code: 500, message: 'error' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ code: 404, message: 'Task not found or not completed' });
            }

            res.status(200).json({ code: 200, message: 'success' });
        }
    );
});

// @url: localhost:3030/edit/:id
// @method: POST
// @function: update a todo's name(by setting its name)
app.post('/edit/:id', (req, res) => {
    const { name, start, end, priority } = req.query;
    const id = req.params.id;

    let updateQuery = "UPDATE todo SET ";
    let updateFields = [];
    if (name) {
        updateFields.push(`name = '${name}'`);
    }
    if (start) {
        updateFields.push(`start = '${start}'`);
    }
    if (end) {
        updateFields.push(`end = '${end}'`);
    }
    if (priority) {
        updateFields.push(`priority = '${priority}'`);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ code: 400, message: 'No fields to update' });
    }

    updateQuery += updateFields.join(", ") + ` WHERE id = ${id}`;

    connection.query(updateQuery, err => {
        if (err) {
            console.log("[UPDATE ERROR] - ", err.message);
            return res.status(500).json({ code: 500, message: 'error' });
        }
        res.status(200).json({ code: 200, message: 'success' });
    });
});


app.listen(3030, () => {
    console.log('Server started on port 3030')
})
