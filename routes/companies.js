const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError")

const db = require("../db");

router.get("/",
      async function (req, res, next) {
  try {
    const code = req.body.code;
    const name = req.body.name;
    const description = req.body.description;
    const results = await db.query(
      `SELECT code, name, description 
       FROM companies`);
    return res.json(results.rows);
  }
  catch (err) {
    return next(err);
  }
});

router.get("/:code",
      async function (req, res, next) {
  try {
    const code = req.body.code;
    const name = req.body.name;
    const description = req.body.description;
    const results = await db.query(
      `SELECT code, name, description 
       FROM companies WHERE code=$1`, [req.params.code]);
    if (results.rows.length === 0) {
      throw new ExpressError("Not Found", 404);
    }
    else {
      return res.json(results.rows);
    }
  }
  catch (err) {
    return next(err);
  }
});

router.post("/", async function(req, res, next) {
  const {code, name, description } = req.body;
  try {
    const results = await db.query(
      `INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
      return res.status(201).json({company:results.rows[0]});
      // if (results.rows)
    }
  catch(err) {
    return next(err);
    }

});

router.put("/:code", async function(req, res, next) {
  const {code, name, description } = req.body;
  try {
    const results = await db.query(
      `UPDATE companies SET name = $1, description = $2 WHERE code = $3 RETURNING code, name, description`, [name, description, req.params.code]);
      if (results.rows.length === 0) {
        throw new ExpressError("Company Not Found", 404);
      }
      else {
        return res.json(results.rows[0]);
      }
    }
  catch(err) {
    return next(err);
    }

});

router.delete("/:code", async function(req, res, next) {
  const {code, name, description } = req.body;
  try {
    const results = await db.query(
      `DELETE FROM companies WHERE code = $1 RETURN name`, [req.params.code]);
      if (results.rows.length === 0) {
        throw new ExpressError("Company Not Found", 404);
      }
      else {
        return res.json({message: "Deleted"});
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