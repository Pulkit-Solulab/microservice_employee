const express = require('express');
const router = new express.Router();

const { create,
    getEmployee,
    getAll,
    deleteEmployee,
    deleteAll,
    update
} = require('../controllers/employee.controller');

router.post('/employee', create);

router.get('/employee/:id', getEmployee);

router.get('/employee/', getAll);

router.delete('/employee/:id', deleteEmployee);

router.delete('/employee', deleteAll);

router.patch('/employee/:id', update);

module.exports = router;