import Price from '../models/Prices.js';


export const createPrice = async (req, res, next) => {
  try {
    const newPrice = new Price(req.body); // req.body debería contener priceAdult, priceChild, category sin el _id
    const savedPrice = await newPrice.save();
    res.status(201).json(savedPrice);
  } catch (err) {
    next(err);
  }
};

export const getPrice = async (req, res, next) => {
  try {
    const price = await Price.findById(req.params.id)
    res.status(200).json(price);
  } catch (err) {
    next(err);
  }
};

export const getLastPrice = async (req, res, next) => {
  try {
    const { category } = req.params; // Obtener la categoría desde la URL
    if (!category) {
      return res.status(400).json({ message: "Categoría es requerida" });
    }

    const lastPrice = await Price.findOne({ category }).sort({ createdAt: -1 });

    if (!lastPrice) {
      return res.status(404).json({ message: `No hay precios disponibles para ${category}` });
    }

    res.status(200).json(lastPrice);
  } catch (err) {
    next(err);
  }
};

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


export const getPrices = async(req, res, next) =>{
    try{
        const prices = await Price.find();

        res.status(200).json(prices)
     }catch(err) {
         next(err)
     }

}

// GET /prices/:category/:date
export const getPriceByDate = async (req, res, next) => {
  try {
    const { category, date } = req.params;
    const targetDate = new Date(date);

    const price = await Price.findOne({
      category,
      createdAt: { $lte: targetDate }
    }).sort({ createdAt: -1 }); // más reciente primero

    if (!price) {
      return res.status(404).json({ message: "No se encontró precio para esa fecha" });
    }

    res.status(200).json(price);
  } catch (err) {
    next(err);
  }
};

