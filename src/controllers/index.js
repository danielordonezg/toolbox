const axios = require("axios");
const csv = require("csv-parser");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });
require("dotenv").config();
const cacheKey = process.env.CACHE_KEY;
const authKey = process.env.SECRET;

const formatCSV = (data) => {
  return new Promise((resolve, reject) => {
    const csvData = data;
    const rows = [];
    const parser = csv();

    parser.write(csvData);
    parser.end();

    parser.on("data", (row) => {
      if (
        Object.keys(row).length === 4 &&
        Object.values(row).every((value) => value !== "")
      ) {
        rows.push(row);
      }
    });

    parser.on("end", () => {
      resolve(rows);
    });

    parser.on("error", (error) => {
      console.error(error.message);
      reject(error);
    });
  });
};

const getFiles = async () => {
  const info = await axios.get("https://echo-serv.tbxnet.com/v1/secret/files", {
    headers: {
      Authorization: `Bearer ${authKey}`,
    },
  });
  const bank = info.data.files;

  const promises = bank.map((file) => {
    return axios
      .get(`https://echo-serv.tbxnet.com/v1/secret/file/${file}`, {
        headers: {
          Authorization: `Bearer ${authKey}`,
        },
      })
      .then(async (response) => {
        const toconvert = await formatCSV(response.data);
        return toconvert;
      })
      .catch((error) => {
        console.log(error.message);
        return [];
      });
  });

  const results = await Promise.all(promises);

  return results.concat().flat();
};

exports.getFileData = async (req, res) => {
  try {
    let cachedData = cache.get(cacheKey);
    if (cachedData) {
      if (req.query.filename) {
        cachedData = cachedData.filter(
          (item) => item.file === req.query.filename
        );
      }
      return res.status(200).json(cachedData);
    }

    let response = await getFiles();

    cache.set(cacheKey, response);

    if (req.query.filename) {
      response = response.filter((item) => item.file === req.query.filename);
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.listFilenames = async (req, res) => {
  try {
    let cachedData = cache.get(cacheKey);
    if (cachedData) {
      const files = cachedData.map((item) => item.file);
      const uniqueFiles = [...new Set(files)];
      return res.json(uniqueFiles);
    }

    let response = await getFiles();

    cache.set(cacheKey, response);

    let getFilenames = response.map((item) => item.file);
    let cleanFiles = [...new Set(getFilenames)];

    return res.json(cleanFiles);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
