import { fetchBestSellersModel } from '../../models/getProducts.model.js';

// Controller to handle fetching best-selling products
export const getBestSellers = async (req, res) => {
  try {
    const bestSellers = await fetchBestSellersModel();
    if (bestSellers.length === 0) {
      return res.status(404).json({ message: 'No best sellers found' });
    }
    return res.status(200).json(bestSellers);
  } catch (error) {
    console.log('getBestSellers Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};



