const fs = require('fs');

async function readDirectory(directoryPath) {
    const files = await fs.promises.readdir(directoryPath);
    return files
}
async function readFileContent(filePath) {
    const content = await fs.promises.readFile(filePath, 'utf-8');
    return content
}
module.exports = {
    find: async (req, res) => {
        try {
            let files = await readDirectory("./files")
            return res.status(200).json(files)
        } catch (error) {
            console.log(error)
            return res.status(500).send("Internal server error")
        }
    },
    findOne: async (req, res) => {
        try {
            let fileName = req.params.filename
            let fileContent = await readFileContent(`./files/${fileName}`)
            return res.status(200).send(fileContent)
        } catch (error) {
            console.log(error)
            if (error.errno == -4058) return res.status(404).send("File not found")
            return res.status(500).send()
        }
    }
}