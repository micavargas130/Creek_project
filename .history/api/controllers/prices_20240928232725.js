import Price from '../models/Prices.js';

export const updatePrices = async (req, res, next) => {
  try {
    const { priceAdult, priceChild } = req.body;
    const priceId = req.params.id; 

    // Usamos findByIdAndUpdate para actualizar el documento existente
    const updatedPrice = await Price.findByIdAndUpdate(
      priceId, // ID del precio que quieres actualizar
      { priceAdult, priceChild }, // Datos actualizados
      { new: true } // Esto asegura que obtengas el documento actualizado
    );

    if (!updatedPrice) {
      return res.status(404).json({ message: "Precio no encontrado" });
    }

    res.status(200).json(updatedPrice); // Devuelve el precio actualizado
  } catch (err) {
    next(err);
  }
};


export const getPrice = async (req, res, next) => {
  try {
      const price = await Price.findById(req.params.id);
      res.status(200).json(price);
  } catch (err) {
      next(err);
  }
};