import  Employee } from "../models/Employees";

export const createEmployee = async (req, res, next) => {
    const { email, password, first_name, last_name, dni, phone, birthday, occupation, job, base_salary, start_date, photo } = req.body;

    try {
        // Crear el usuario
        const newUser = new User({
            email,
            password,
            first_name,
            last_name,
            dni,
            phone,
            birthday,
            occupation,
            isEmployee: true
        });

        const savedUser = await newUser.save();

        // Crear el empleado asociado al usuario
        const newEmployee = new Employee({
            user: savedUser._id,
            job,
            base_salary,
            start_date,
            photo
        });

        const savedEmployee = await newEmployee.save();

        res.status(200).json(savedEmployee);
    } catch (err) {
        next(err);
    }
};

export const updateEmployee = async (req, res, next) => {
    const { userId, ...employeeData } = req.body;

    try {
        // Actualizar los datos del empleado
        const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, { $set: employeeData }, { new: true });

        if (userId) {
            // Actualizar los datos del usuario si se proporcionan
            const { email, password, first_name, last_name, dni, phone, birthday, occupation } = req.body;
            const updatedUser = await User.findByIdAndUpdate(userId, {
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
        const employee = await Employee.findById(req.params.id).populate('user');
        res.status(200).json(employee);
    } catch (err) {
        next(err);
    }
};

export const getEmployees = async (req, res, next) => {
    try {
        const employees = await Employee.find().populate('user');
        res.status(200).json(employees);
    } catch (err) {
        next(err);
    }
};
