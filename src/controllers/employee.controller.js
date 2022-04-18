const Employee = require('../models/employee')
const ObjectId = require('mongoose').Types.ObjectId

function isValidObjectId(id){
    if(ObjectId.isValid(id)){
        if((String)(new ObjectId(id)) === id)
            return true;        
        return false;
    }
    return false;
}

// for creating employee
const create = async (req, res) => {
    const employee = new Employee(req.body);
    try {
        await employee.save();
        res.status(201).send(employee);       // 201 created
    } catch (error) {
        res.status(500).send(error);         // 500 server error
    }
}

// for retrieving employee
const getEmployee = async (req, res) => {
    const __id = req.params.id;
    // ID Validation
    if(!isValidObjectId(__id)){
        return res.status(400).send({error: 'Invalid Id'});
    }
    try {
        const employee = await Employee.find({ _id: ObjectId(__id), isActive: true });
        res.status(200).send(employee);      // 200 OK
    } catch (error) {
        res.status(500).send(error);         // 500 server error
    }
}

// for retrieving all employees
const getAll = async (req, res) => {
    try {
        const employees = await Employee.find({isActive: true});
        res.status(200).send(employees);      // 200 OK
    } catch (error) {
        res.status(500).send(error);         // 500 server error
    }
}

// for deleting a employee by ID
const deleteEmployee = async (req, res) => {
    const __id = req.params.id;
    // ID Validation
    if(!isValidObjectId(__id)){
        return res.status(400).send({error: 'Invalid Id'});
    }
    try {
        const [employee] = await Employee.find({ _id: ObjectId(__id) })
        console.log(employee)
        if (!employee) {
            return res.status(400).send({error: `Employee doesn't exist!`});
        }

        if (!employee.isActive) {
            return res.status(400).send({error: `Employee already deleted!`});
        }

        employee.isActive = false;
        await employee.save();
        res.status(200).send(employee);      // 200 OK
    } catch (error) {
        res.status(500).send(error);         // 500 server error
    }
}

// for deleting all employees
const deleteAll = async (req, res) => {
    try {
        const employee = await Employee.updateMany(
            {isActive: true},
            {$set: { 'isActive': false }})
        res.status(200).send(employee);      // 200 OK
    } catch (error) {
        res.status(500).send(error);         // 500 server error
    }
}

// for updating a employee by ID
const update = async (req, res) => {
    const __id = req.params.id
    // ID Validation
    if(!isValidObjectId(__id)){
        return res.status(400).send({error: 'Invalid Id'})
    }

    const updates = Object.keys(req.body)
    
    // valid fields for update
    const allowedUpdates = ['firstName', 'lastName', 'designation']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    // checking for valid updates
    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid Updates'})
    }

    try {
        const employee = await Employee.find({ _id: ObjectId(__id), isActive: true })

        if (!employee) {
            return res.status(404).send({error: 'Employee Not Found!'})  // 404 not found
        }

        updates.forEach( update => employee[update] = req.body[update])
        await employee.save()
        res.status(200).send(employee)       // 200 OK
    } catch (error) {
        res.status(500).send(error)         // 500 server error
    }
}

module.exports = {
    create,
    getEmployee,
    getAll,
    deleteEmployee,
    deleteAll,
    update
}