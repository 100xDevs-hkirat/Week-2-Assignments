const fs = require("node:fs/promises");

const readFromFile = async (fileName) => {
  try {
    return await fs.readFile(fileName, { encoding: "utf8" });
  } catch (err) {
    throw err;
  }
};

exports.readFromFile = readFromFile;
