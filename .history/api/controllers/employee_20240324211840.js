import Employees from "../models/Employees.js"

export const createEmployee = async (req, res, next) => {
    const newEmployee = new Employees(req.body)  //body guarda la info de la cabaña 
    try{

        const savedEmployee = await newEmployee.save()
        res.status(200).json(savedEmployee)


    }catch(err){
        next(err); 
    }
};

export const updateEmployee = async (req, res, next) => {
    try {
      const employeeId = req.params.employeeId; // Corrected parameter name
      const updatedFields = req.body;
  
      // Check if there are any fields to update
      if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ message: "No fields to update." });
      }
  
      // Find the employee by ID
      const employee = await Employees.findById(employeeId);
  
      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }
  
      // Update only the fields that are present in the request body
      Object.keys(updatedFields).forEach((field) => {
        employee[field] = updatedFields[field];
      });
  
      // Save the updated employee
      const updatedEmployee = await employee.save();
  
      res.status(200).json(updatedEmployee);
    } catch (err) {
      next(err);
    }
  };

export const getEmployee = async(req, res, next) =>{
    try{
        const employee = await Employees.findById(req.params.id) //busca el lodge con el id que le pasamos 
         res.status(200).json(employee)
     }catch(err) {
        next(err);
     }
};


export const getEmployees = async(req, res, next) =>{
    try{
        const employees = await Employees.find()
         res.status(200).json(employees)
     }catch(err) {
         next(err)
     }

};
