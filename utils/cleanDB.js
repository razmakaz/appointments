import fs from 'fs'
import { config } from '../src/config.js'
import sqlite3 from 'sqlite3'
import seed from '../src/seed.js'

const dbPath = `./${config.dbFile}`

const cleanDB = () => {

    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath)
        console.log("File removed successfully.")
    } else {
        console.log("No DB present.")
    }
    
    console.log("Creating new DB file.")
    fs.closeSync(fs.openSync(dbPath, 'w'))
    
    console.log("Success! New DB created.")
    
    console.log("Seeding...")
    
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => {
        if (err) console.error(err.code, err.message)
    })
    
    console.log(" - Created Database")
    
    db.serialize(() => {
    
        console.log(" - Opened Database")
    
        db.run(`
            CREATE TABLE ${config.table} (
                id VARCHAR(36) PRIMARY KEY,
                appointment DATETIME,
                description VARCHAR(255),
                customer VARCHAR(255),
                image VARCHAR(255)
            );
        `)
        console.log(" - Created Table ")
    
        let query = `INSERT INTO ${config.table} (
            id,
            appointment,
            description,
            customer,
            image 
        ) VALUES `

        for (let i = 0; i < seed.length; i++) {
            let item = seed[i]
            query += `(
                "${item.id}",
                "${item.appointment}",
                "${item.description}",
                "${item.customer}",
                "${item.image}"
            )`
            if (i+1 < seed.length) {
                query += `,`  
            }
        }
        query += ';'

        console.log(query)
        db.run(query)
        
        console.log(" - Seeded Database")

        db.all(`SELECT * FROM ${config.table} LIMIT 1`, [], (err, rows) => {
            console.log("- Confirm Seed with First Entry")
            console.log(rows)
        })
    
    })
    
    
    db.close(err => {
        if (err) console.error(err.code, err.message)
    })
    
    console.log(" - Closed Database")
}

export default cleanDB