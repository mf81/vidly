const { Customers, validate } = require("../models/customerModel");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const getCustomers = await Customers.find().select({ name: 1, phone: 1 });
  res.send(getCustomers);
});

router.get("/:id", async (req, res) => {
  try {
    const getOneCustomer = await Customers.findById({
      _id: req.params.id
    }).select({ name: 1, phone: 1 });

    res.send(getOneCustomer);
  } catch (err) {
    return res.status("400").send(`No ID ${err}`);
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let postCustomer = new Customers({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone
  });

  postCustomer = await postCustomer.save();
  res.send(postCustomer);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const updateCustomer = await Customers.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    res.send(updateCustomer);
  } catch (err) {
    return res.status("400").send(`No ID ${err}`);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const del = await Customers.findByIdAndDelete({ _id: req.params.id });
    res.send(del);
  } catch (err) {
    return res.status("400").send(`No ID ${err}`);
  }
});

//   //   const del = await Customers.findByIdAndRemove(
//   //     { _id: req.params.id },
//   //     function(err, res) {
//   //       if (err) {
//   //         console.log("error in deleting yo!");
//   //         console.error(err);
//   //       } else {
//   //         console.log("data all gone and deleted yo");
//   //         res.status(204);
//   //       }
//   //     }
//   //   );
// });

module.exports = router;
