import Schedule from "../models/Schedule.js";


export const createSchedule = async (req, res) => {
  try {
    const { employee, task, startDate, endDate, description } = req.body;
    const newSchedule = new Schedule({ employee, task, startDate, endDate, description});
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el horario", error });
  }
};

export const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find().populate("employee");
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los horarios", error });
  }
};


export const getScheduleByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const schedules = await Schedule.find({ employee: employeeId });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el horario del empleado", error });
  }
};


export const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const updatedSchedule = await Schedule.findByIdAndUpdate(scheduleId, req.body, { new: true });
    res.status(200).json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el horario", error });
  }
};


export const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    await Schedule.findByIdAndDelete(scheduleId);
    res.status(200).json({ message: "Horario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el horario", error });
  }
};


export const deleteAllSchedules = async (req, res) => {
  try {
    await Schedule.deleteMany({});
    res.status(200).json({ message: "Todos los horarios han sido eliminados correctamente." });
  } catch (error) {
    console.error("Error al eliminar los horarios:", error);
    res.status(500).json({ message: "Hubo un error al eliminar los horarios." });
  }
};

