const express = require(`express`);
const multer = require(`multer`);
const fs = require(`fs`);
const router = express.Router();
const dayjs = require("dayjs");

const { Billing, findBillings, readData } = require("./models/mongoose.js");

let fileName = ``;
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./src/files`);
  },
  filename: (req, file, cb) => {
    fileName = file.originalname;
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: fileStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(txt||csv)$/)) {
      return cb(new Error(`File not supported for processing.`));
    }
    cb(undefined, true);
  },
});

router.post(
  `/upload`,
  upload.single(`upload`),
  (req, res, next) => {
    if (fileName.includes(`.csv`)) {
      readCSV(fileName, async (err, request) => {
        if (err) {
          return next(err);
        }
        try {
          const billrecords = await getBillingRecords(request);
          console.log("Bill Records", billrecords);
          res.status(200).send(billrecords);
        } catch (err) {
          return next(err);
        }
      });
    } else if (fileName.endsWith(`.txt`)) {
      readTXT(fileName, async (err, request) => {
        // const billings = await Billings.findOne();
        if (err) {
          return next(err);
        }
        try {
          const billrecords = await getBillingRecords(request);
          console.log("Bill Records", billrecords);
          res.status(200).send(billrecords);
        } catch (err) {
          return next(err);
        }
      });
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

const getBillingRecords = (requestedDataArray) =>
  new Promise(async (resolve, reject) => {
    const trial = await Promise.all(
      requestedDataArray.map(async ({ billingCycle, startDate, endDate }) => {
        try {
          const billDetails = await findBillings(
            billingCycle,
            startDate,
            endDate
          );
          return billDetails;
        } catch (err) {
          reject(err);
        }
      })
    );
    resolve(trial);
  });

const readCSV = (fileName, cb) => {
  fs.readFile(`./src/files/${fileName}`, "utf-8", async (error, data) => {
    let errMessage = error;
    if (data.length === 0) {
      return cb(new Error("No request(s) to read from the input file."));
    }
    const myData = data.split("\r\n");

    const billdata = myData.map((infos, index) => {
      const [billing_cycle, start_date, end_date] = infos.split(",");
      const newdata = {
        billingCycle: Number(billing_cycle),
        startDate: formatDate(dayjs(start_date).format("YYYY-MM-DD")),
        endDate: formatDate(dayjs(end_date).format("YYYY-MM-DD")),
      };

      if (billing_cycle < 1 || billing_cycle > 12) {
        return (errMessage = new Error(
          `ERROR: Billing Cycle not on range at row ${index + 1}.`
        ));
      } else if (!dayjs(start_date).isValid()) {
        return (errMessage = new Error(
          `ERROR: Start date not on range at row ${index + 1}.`
        ));
      } else if (!dayjs(end_date).isValid()) {
        return (errMessage = new Error(
          `ERROR: End Date not on range at row ${index + 1}.`
        ));
      }
      return newdata;
    });
    cb(errMessage, billdata);
  });
};

const formatDate = (date) => {
  const [year, month, day] = date.split("-");
  return new Date(Date.UTC(year, month - 1, day, 0));
};

const readTXT = (fileName, cb) => {
  fs.readFile(`./src/files/${fileName}`, "utf-8", async (error, data) => {
    let errMessage = error;
    if (data.length === 0) {
      console.log("No request(s) to read from the input file.");
      return cb(new Error("No request(s) to read from the input file."));
    }

    myData = data.split("\r\n");

    const billDate = myData.map((item, index) => {
      const [billing_cycle, start_date, end_date] = [
        item.slice(0, 2),
        `${item.slice(2, 4)}/${item.slice(4, 6)}/${item.slice(6, 10)}`,
        `${item.slice(10, 12)}/${item.slice(12, 14)}/${item.slice(14, 18)}`,
      ];

      const newdata = {
        billingCycle: Number(billing_cycle),
        startDate: formatDate(dayjs(start_date).format("YYYY-MM-DD")),
        endDate: formatDate(dayjs(end_date).format("YYYY-MM-DD")),
      };

      if (billing_cycle < 1 || billing_cycle > 12) {
        return (errMessage = new Error(
          `ERROR: Billing Cycle not on range at row ${index + 1}.`
        ));
      } else if (!dayjs(start_date).isValid()) {
        return (errMessage = new Error(
          `ERROR: Start date not on range at row ${index + 1}.`
        ));
      } else if (!dayjs(end_date).isValid()) {
        return (errMessage = new Error(
          `ERROR: End Date not on range at row ${index + 1}.`
        ));
      }
      return newdata;
    });
    cb(errMessage, billDate);
  });
};

module.exports = { router, readCSV, readTXT };
