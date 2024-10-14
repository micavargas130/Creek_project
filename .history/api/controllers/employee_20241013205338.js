import Employee from "../models/Employees.js";
import User from "../models/User.js";
import Status from "../models/EmployeeStatus.js";

import bcrypt from "bcryptjs"; // Asegúrate de importar bcrypt


export const updateEmployee = async (req, res, next) => {
    const { userId, statusId, ...employeeData } = req.body;

    try {
        // Actualizar los datos del empleado
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { $set: { ...employeeData, status: statusId } }, { new: true });

        if (userId) {
            // Actualizar los datos del usuario si se proporcionan
            const { email, password, first_name, last_name, dni, phone, birthday, occupation } = req.body;
            await User.findByIdAndUpdate(userId, {
                email,
                password,
                first_name,
                last_name,
                dni,
                phone,
                birthday,
                occupation
            }, { new: true });
        }

        res.status(200).json(updatedEmployee);
    } catch (err) {
        next(err);
    }
};


export const getEmployee = async (req, res, next) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('user').populate('status');
        res.status(200).json(employee);
    } catch (err) {
        next(err);
    }
};

export const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('user').populate('status');
        res.status(200).json(employees);
    } catch (err) {
        next(err);
    }
};
