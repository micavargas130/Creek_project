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
      const price = await Price.findById(req.);
      res.status(200).json(price);
  } catch (err) {
      next(err);
  }
};