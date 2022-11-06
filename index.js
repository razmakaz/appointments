import express from 'express'
import sqlite3 from 'sqlite3'
import { config } from './src/config.js'
import cleanDB from './utils/cleanDB.js'
import { faker } from '@faker-js/faker'
import bodyParser from 'body-parser'

/**
 * SERVER SETUP
 */
const app = express()
app.set('json spaces', 2)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const router = express.Router()

const dbPath = `./${config.dbFile}`
/**
 * DB INIT
 */

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => {
     if (err) {
        console.log("Couldn't open Database...")
        console.log("Cleaning")
        cleanDB()
    }
})
db.close()

/**
 * API
 */
router.get('/', (req, res) => res.json({
    message: "API is online.",
}))

router.get('/appointments', (req, res) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => err && res.json({message: "ERROR", data: err}))
    db.all(`SELECT * FROM ${config.table}`, [], (err, rows) => {
        res.json({
            message: "OK",
            data: rows,
        })
    })
    db.close()
})

router.get('/appointments/:id', (req, res) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => err && res.json({message: "ERROR", data: err}))
    db.all(`SELECT * FROM ${config.table} WHERE id="${req.params.id}"`, [], (err, rows) => {
        res.json({
            message: "OK",
            data: rows[0] ?? {},
        })
    })
    db.close()
})

router.get('/appointments/by_date/:date', (req, res) => {
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => err && res.json({message: "ERROR", data: err}))
    try {
        const date = new Date(req.params.date).toISOString()
        db.all(`SELECT * FROM ${config.table} WHERE appointment="${date}"`, [], (err, rows) => {
            res.json({
                message: "OK",
                data: rows,
            })
        })
        db.close()
    } catch(err) {
        res.json({
            message: "ERROR",
            data: err
        })
    }

})

router.post('/appointments', (req, res, next) => {
    let errors = []

    console.log(req.body)

    if (!req.body.customer) errors.push("No Customer specified.")
    if (!req.body.appointment) errors.push("No appointment date.")

    // Validate the appointment string.
    try {
        new Date(req.body.appointment).toISOString()
    } catch(err) {
        errors.push("Date for appointment isn't valid.")
    }

    // Sanitize the description if present, otherwise create it.
    if (req.body.description) {
        req.body.description = req.body.description.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"")
    } else {
        req.body.description = faker.lorem.sentence()
    }

    // Validate URL
    if (req.body.image) {
        let url = new URL(req.body.image)
        if (url.origin) {
            req.body.image = url.origin
        } else {
            errors.push("URL for image isn't valid.")
        }
    } else {
        req.body.image = faker.internet.avatar()
    }

    // If there's errors, return them
    if (errors.length > 0) {
        res.json({
            message: "ERROR",
            errors,
        })
    } else {
        // Otherwise insert the data.
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => err && res.json({message: "ERROR", data: err}))
        db.run(`
            INSERT INTO ${config.table} (
                id,
                appointment,
                customer,
                description,
                image
            ) VALUES (
                "${faker.datatype.uuid()}",
                "${new Date(req.body.appointment).toISOString()}",
                "${req.body.customer}",
                "${req.body.description}",
                "${req.body.image}"
            );
        `)
        db.close()
    }
})

router.patch('/appointments/:id', (req, res) => {
    let id = req.params.id
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => err && res.json({message: "ERROR", data: err}))
    let query = `UPDATE ${config.table} SET `
    let columns = ['appointment', 'customer', 'description', 'image']
    columns.forEach((col, i) => {
        if (req.body[col]) query += `${col} = "${req.body[col]}"`
    })
    query += ` WHERE id="${id}"`
    db.run(query, [], (err, rows) => {
        res.json(err ?? {message: "UPDATED", data: id})
    })
    db.close()
})

router.delete('/appointments/:id', (req, res) => {
    let id = req.params.id
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => err && res.json({message: "ERROR", data: err}))
    db.run(`DELETE FROM ${config.table} WHERE id="${id}"`, [], (err, rows) => {
        console.log(err, rows)
        res.json(err ?? {message: "DELETED", data: id})
    })
    db.close()
})


app.use('/', router)


/**
 * SERVER
 */
app.listen(config.port, () => {
    console.log(`App listening on port ${config.port}`)
})
