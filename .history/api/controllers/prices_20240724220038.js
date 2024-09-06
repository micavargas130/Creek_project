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
