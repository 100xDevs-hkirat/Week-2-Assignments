const fs = require('fs');


async function readFile() {
    try {
        const data = await fs.promises.readFile('./todo/db.txt', 'utf8');
        return data
    } catch (error) {
        console.error('Error reading file:', error);
    }
}

async function writeFileAsync(data) {
    try {
        await fs.promises.writeFile('./todo/db.txt', JSON.stringify(data), 'utf8');
        return true
    } catch (err) {
        console.error('Error writing to file:', err);
        return false
    }
}
function mergeObjects(obj1, obj2) {
    for (let key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            if (obj1.hasOwnProperty(key)) {
                // Update the value if the key already exists in obj1
                obj1[key] = obj2[key];
            } else {
                // Add the key-value pair to obj1 if it doesn't exist
                obj1[key] = obj2[key];
            }
        }
    }
}

module.exports = {
    find: async (req, res) => {
        try {
            let entries = await readFile()
            if (entries.length === 0) {
                return res.status(404).json()
            }
            entries = JSON.parse(entries)
            return res.status(200).json(entries)
        } catch (error) {
            return res.status(500).json("Internal server error")
        }
    },
    findOne: async (req, res) => {
        try {
            let id = parseInt(req.params.id)
            let entries = await readFile()
            if (entries.length === 0) {
                return res.status(404).json()
            }
            entries = JSON.parse(entries)
            for (let entry of entries) {
                if (entry.id === id) {
                    return res.status(200).json(entry)
                }
            }
            return res.status(404).json({})
        } catch (error) {
            return res.status(500).json("Internal server error")
        }
    },
    updateOne: async (req, res) => {
        try {
            let id = parseInt(req.params.id)
            let entries = await readFile()
            if (entries.length === 0) {
                return res.status(404).json()
            }
            let data = JSON.parse(entries)
            for (let entry of data) {
                if (entry.id === id) {
                    mergeObjects(entry, req.body || {})
                    let written = await writeFileAsync(data)
                    if (written === false) {
                        return res.status(500).json("Internal server error")
                    }
                    return res.status(200).json()
                }
            }
            return res.status(404).json()
        } catch (error) {
            return res.status(500).json("Internal server error")
        }
    },
    create: async (req, res) => {
        try {
            let entries = await readFile()
            if (entries.length === 0) {
                entries = []
            } else {
                entries = JSON.parse(entries)
            }
            let entry = { ...req.body, id: Date.now() }
            entries.push(entry)
            let written = await writeFileAsync(entries)
            if (written === false) {
                return res.status(500).json("Internal server error")
            }
            return res.status(201).json(entry)
        } catch (error) {
            return res.status(500).json("Internal server error")
        }
    },
    deleteOne: async (req, res) => {
        try {
            let id = parseInt(req.params.id)
            let entries = await readFile()
            if (entries.length === 0) {
                return res.status(404).json()
            }
            let data = JSON.parse(entries)
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === id) {
                    data.splice(i, 1);
                    let written = await writeFileAsync(data);
                    if (written === false) {
                        return res.status(500).json("Internal server error");
                    }
                    return res.status(200).json();
                }
            }
            return res.status(404).json()
        } catch (error) {
            return res.status(500).json("Internal server error")
        }
    }
}