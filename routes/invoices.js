const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")

const db = require("../db");

router.get("/",
  async function (req, res, next) {
    try {

      const results = await db.query(
        `SELECT id, comp_code 
       FROM invoices`);
      return res.json({ invoices: results.rows });
    }
    catch (err) {
      return next(err);
    }
  });

router.get("/:id",
  async function (req, res, next) {
    try {
      const id = req.params.id;


      const invoiceRes = await db.query(
        `SELECT id, amt, paid, add_date, paid_date, comp_code AS company
       FROM invoices WHERE id=$1`, [id]);
      if (invoiceRes.rows.length === 0) {
        throw new ExpressError("Not Found", 404);
      }
      else {
        try {
          const codex = invoiceRes.rows[0].company;
          console.log(invoiceRes.rows[0].company);
          const companyRes = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [codex]);
          console.log("HELOOOOOOOOOOOOOOOOO",codex);
          if (companyRes.rows.length === 0) {
            throw new ExpressError("Company Not Found", 404);
          } else {
            const invoice = invoiceRes.rows[0];
            invoice.company = companyRes.rows[0];
            return res.json({invoice});
            
          }
        }
        catch (err) {
          return next(err);
        }
      }
    }
    catch (err) {
      return next(err);
    }
  });

  router.post("/", async function(req, res, next) {
    const {comp_code, amt } = req.body;
    try {
      const results = await db.query(
        `INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        return res.status(201).json({invoice:results.rows[0]});
        // if (results.rows)
      }
    catch(err) {
      return next(err);
      }
  
  });


  router.put("/:id", async function(req, res, next) {
    const { amt } = req.body;
    const id = req.params.id;

    try {
      const results = await db.query(
        `UPDATE invoices SET amt = $1 WHERE id = $2 RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, id]);
        if (results.rows.length === 0) {
          throw new ExpressError("Invoice Not Found", 404);
        }
        else {
          return res.json({invoice: results.rows[0]});
        }
      }
    catch(err) {
      return next(err);
      }
  });

  router.delete("/:id", async function(req, res, next) {
    const { id } = req.body;
    try {
      const results = await db.query(
        `DELETE FROM invoices WHERE id = $1 RETURNING id`, [req.params.id]);
        if (results.rows.length === 0) {
          throw new ExpressError("Invoice Not Found", 404);
        }
        else {
          return res.json({status: "deleted"});
        }
      }
    catch(err) {
      return next(err);
      }
  });




router.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});

module.exports = router;
// INSERT INTO invoices (comp_Code, amt, paid, paid_date)