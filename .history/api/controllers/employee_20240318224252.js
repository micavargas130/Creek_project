import Employees from "../models/Employees.js"

export const createEmployee = async (req, res, next) => {
    const newEmployee = new Employees(req.body)  //body guarda la info de la cabaña 
    try{

        const savedEmployee = await newEmployee.save()
        res.status(200).json(savedEmployee)


    }catch(err){
        next(err)
}

export const updateEmployee = async(req, res, next) =>{
    try{
        const updateEmployee = await Employees.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})  
        res.status(200).json(updateEmployee)
    }catch(err) {
        next(err);
    }
}


export const getEmployee = async(req, res, next) =>{
    try{
        const employee = await Employees.findByIdAndUpdate(req.params.id) //busca el lodge con el id que le pasamos 
         res.status(200).json(employee)
     }catch(err) {
        next(err);
     }
}


export const getEmployees = async(req, res, next) =>{
    try{
        const employees = await Employees.find()
         res.status(200).json(employees)
     }catch(err) {
         next(err)
     }

}
}

