const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/bars_db", {
  useNewUrlParser: true,
});

const billingSchema = new mongoose.Schema({
  billing_cycle: Number,
  billingMonth: String,
  amount: Number,
  start_date: Date,
  end_date: Date,
  lastEdited: String,
  account: {
    accountName: String,
    dateCreated: Date,
    isActive: String,
    lastEdited: String,
    customer: {
      firstName: String,
      lastName: String,
      address: String,
      status: String,
      dateCreated: Date,
      lastEdited: String,
    },
  },
});

const findBillings = (billing_cycle, start_date, end_date) =>
  new Promise(async (resolve, reject) => {
    const billing = await Billing.findOne({
      billing_cycle,
      start_date,
      end_date,
    });
    if (!billing) {
      return reject(new Error("No record(s) to write to the output file."));
    }
    console.log("Successfully processed Request File");

    return resolve(readData(billing.toJSON()));
  });

const readData = (billing) => {
  return {
    id: billing._id,
    billing_cycle: billing.billing_cycle,
    start_date: billing.start_date,
    end_date: billing.end_date,
    amount: billing.amount,
    account_name: billing.account.account_name,
    first_name: billing.account.customer.first_name,
    last_name: billing.account.customer.last_name,
  };
};

const Billing = mongoose.model("Billing", billingSchema);

module.exports = { Billing, findBillings, readData };
