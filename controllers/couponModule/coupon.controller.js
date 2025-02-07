import {
  createCouponModel,
  deleteCouponByIdModel,
  editCouponByIdModel,
  getAllCouponModel,
  getCouponByIdModel,
  validateCouponModel,
} from "../../models/coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    const {
      coupon_code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      product_id,
    } = req.body;

    const result = await createCouponModel(
      coupon_code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      product_id
    );

    return res.status(201).json({ message: "Coupon created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to create coupon", details: error.message });
  }
};

export const getAllCoupon = async (req, res) => {
  try {
    const coupons = await getAllCouponModel();
    return res.status(200).json(coupons);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve coupons", details: error.message });
  }
};

export const getCouponById = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const [coupon] = await getCouponByIdModel(couponId);
    if (!coupon.length) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    return res.status(200).json(coupon[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to retrieve coupon", details: error.message });
  }
};

export const editCouponById = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const {
      coupon_code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      product_id,
    } = req.body;
    const result = await editCouponByIdModel(
      coupon_code,
      discount_type,
      discount_value,
      start_date,
      end_date,
      product_id,
      couponId
    );
    return res.status(200).json({ message: "Coupon updated successfully!" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update coupon", details: error.message });
  }
};

export const deleteCouponById = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const result = await deleteCouponByIdModel(couponId);
    return res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to delete coupon", details: error.message });
  }
};

// Validate coupon by code
export const validateCoupon = async (req, res) => {
  try {
    const { coupon_code, product_id, user_id, total_price } = req.body;

    const orders = await getOrderByUserIdModel(user_id);

    const isFirstPurchase = (orders?.length || 0) === 0;

    // First-time purchase validation
    if (coupon_code === "WELCOME" && !isFirstPurchase) {
      return res.status(400).json({
        message: "WELCOME coupon is valid only for first-time purchases",
      });
    }

    const coupon = await validateCouponModel(coupon_code, product_id);

    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }
    if (coupon.coupon_status === "expired") {
      return res.status(400).json({ message: "Coupon is expired" });
    }

    // Check minimum order value condition
    if (coupon.Min_Order_Value && total_price < coupon.Min_Order_Value) {
      return res.status(400).json({
        message: `Coupon is valid only for orders above ₹${coupon.Min_Order_Value}`,
      });
    }
    return res.status(200).json({ message: "Coupon is valid", coupon });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to validate coupon", details: error.message });
  }
};
