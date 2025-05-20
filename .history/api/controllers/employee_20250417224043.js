import Employee from "../models/Employees.js";
import User from "../models/User.js";
import Status from "../models/EmployeeStatus.js";
import bcrypt from "bcryptjs"; // Asegúrate de importar bcrypt

export const createEmployee = async (req, res, next) => {
    const { email, first_name, last_name, dni, phone, birthday, job, base_salary, start_date, photo } = req.body;

    try {
        // Encriptar la contraseña por defecto "0camping" antes de crear el usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("0camping", salt);

        // Crear el usuario con la contraseña encriptada
        const newUser = new User({
            email,
            password: hashedPassword,  // Contraseña encriptada
            first_name,
            last_name,
            dni,
            phone,
            birthday,
            isEmployee: true
        });

        const savedUser = await newUser.save();

        // Obtener el estado por defecto (e.g., "Activo")
        const defaultStatus = await Status.findOne({ name: "Activo" });

        // Crear el empleado asociado al usuario y al estado por defecto
        const newEmployee = new Employee({
            user: savedUser._id,
            job,
            base_salary,
            start_date,
            photo,
            status: defaultStatus._id
        });

        const savedEmployee = await newEmployee.save();

        res.status(200).json(savedEmployee);
    } catch (err) {
        next(err);
    }
};


export const updateEmployee = async (req, res, next) => {
    const { userId, statusName, ...employeeData } = req.body;

    try {
        // Buscar el estado por nombre
        const status = await Status.findOne({ name: statusName });
        if (!status) {
            return res.status(404).json({ message: 'Estado no encontrado' });
        }

        // Actualizar los datos del empleado, incluyendo el ID del estado
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { 
            $set: { ...employeeData, status: status._id }  // Guardar el ID del estado encontrado
        }, { new: true });

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
