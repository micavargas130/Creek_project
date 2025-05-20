import Price from '../models/Prices.js';




export const updatePrices = async (req, res, next) => {
  try {
    const { priceAdult, priceChild } = req.body;
    let priceId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(priceId)) {
      // Si el ID no es válido, obtenemos el último documento insertado
      const lastPrice = await Price.findOne().sort({ createdAt: -1 });
      if (!lastPrice) {
        return res.status(404).json({ message: "No hay precios en la base de datos." });
      }
      priceId = lastPrice._id;
    }

    // Actualizar el precio existente
    const updatedPrice = await Price.findByIdAndUpdate(
      priceId,
      { priceAdult, priceChild },
      { new: true }
    );

    if (!updatedPrice) {
      return res.status(404).json({ message: "Precio no encontrado" });
    }

    res.status(200).json(updatedPrice);
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