import Price from '../models/Prices.js';

export const updatePrices = async (req, res, next) => {
  try {
    const { priceAdult, priceChild} = req.body;
    const newPrice = new Price({
      priceAdult,
      priceChild,
    });

    await newPrice.save();
    res.status(200).json(newPrice);
  } catch (err) {
    next(err);
  }
};

export const getPrice = async (req, res, next) => {
  try {
      const price = await Prices.findById(req.params.id).populate('state');
      res.status(200).json(lodge);
  } catch (err) {
      next(err);
  }
};