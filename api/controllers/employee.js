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
            dni: dni || undefined,
            phone,
            birthday,
            isEmployee: true
        });

        // Obtener el estado por defecto antes de crear nada, para no dejar un usuario sin empleado
        const defaultStatus = await Status.findOne({ name: "Activo" });
        if (!defaultStatus) {
            return res.status(500).json({ message: 'El estado "Activo" no existe en la base de datos' });
        }

        const savedUser = await newUser.save();

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
        // Buscar el estado por nombre (es opcional: si no viene, se mantiene el actual)
        const update = { ...employeeData };
        if (statusName) {
            const status = await Status.findOne({ name: statusName });
            if (!status) {
                return res.status(404).json({ message: 'Estado no encontrado' });
            }
            update.status = status._id;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });

        if (userId) {
            // Actualizar los datos del usuario si se proporcionan
            const { email, password, first_name, last_name, dni, phone, birthday, ocupation } = req.body;
            await User.findByIdAndUpdate(userId, {
                email,
                //la contraseña siempre se guarda hasheada
                password: password ? await bcrypt.hash(password, 10) : undefined,
                first_name,
                last_name,
                dni: dni || undefined,
                phone,
                birthday,
                ocupation
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

export const getEmployeeByUserId = async (req, res, next) => {
    try {
      const userId = req.params.userId;  
      const employee = await Employee.findOne({ user: userId }).populate('user').populate('status');
  
      if (!employee) {
        return res.status(404).json({ message: "Empleado no encontrado para este usuario" });
      }
  
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
