const Order = require("../models/Orders");
const APIError = require("../helpers/APIError");
const httpStatus = require("http-status");
const Products = require("../models/Products");
const Cart = require("../models/Carts");

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

class OrderController {
  // api/orders (get order by userId)
  getOrder = async (req, res) => {
    console.log("user", req);
    const { _id, _role } = req.user;
    try {
      const order = await Order.find({ _uId: _id })
        .populate("_items.itemId")
        .sort({ createdAt: -1 }); // Sửa '_Items' thành '_items'

      if (!order) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đơn hàng cho user ID này." });
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi lấy thông tin đơn hàng." });
    }
  };

  getOrderByStatus = async (req, res) => {
    const { status } = req.params;
    const { _id, _role } = req.user;
    try {
      const order = await Order.find({ _uId: _id, _status: status })
        .populate("_items.itemId")
        .sort({ createdAt: -1 }); // Sửa '_Items' thành '_items'

      if (!order) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy đơn hàng cho user ID này." });
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin đơn hàng:", error);
      res
        .status(500)
        .json({ error: "Đã xảy ra lỗi khi lấy thông tin đơn hàng." });
    }
  };

  cancelOrder = async (req, res) => {
    const orderId = req.params.id;
    const { _id, _role } = req.user;
    try {
      await Order.findByIdAndUpdate(orderId, {
        _status: 4,
      });
      console.log("====================================");
      console.log("Cho nay sao");
      console.log("====================================");
      const cancelOrder = await Order.findById(orderId).populate([
        "_items.itemId",
      ]);
      console.log("====================================");
      console.log("Cho nay sao2");
      console.log("====================================");
      const listProduct = cancelOrder;
      console.log("====================================");
      console.log("Cho nay sao z ba", listProduct);
      console.log("====================================");
      listProduct._items.forEach(async (pd) => {
        const product = pd.itemId;
        product._quantity += pd.quantity;
        await product.save();
      });
      console.log("====================================");
      console.log("Cho nay sao3");
      console.log("====================================");
      const newListOrder = await Order.find({ _uId: _id, _status: 4 })
        .populate("_items.itemId")
        .sort({
          updatedAt: -1,
        });
      console.log("====================================");
      console.log("data Order", newListOrder);
      console.log("====================================");
      res.status(200).json({
        success: true,
        message: `cancel order success `,
        data: newListOrder,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: `fail to cancel order`,
      });
    }
  };

  vnpayCreatePayment = async (req, res, next) => {
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    var config = require("../configs/default.json");
    var dateFormat = require("dateformat");

    var tmnCode = config.vnp_TmnCode;
    var secretKey = config.vnp_HashSecret;
    var vnpUrl = config.vnp_Url; // Điều chỉnh tên giá trị tương ứng
    var returnUrl = config.vnp_ReturnUrl;

    var date = new Date();

    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var orderId = dateFormat(date, "HHmmss");
    var amount = req.body.amount;
    var bankCode = req.body.bankCode;
    var orderInfo = req.body.orderDescription;
    var orderType = req.body.orderType;
    var locale = req.body.language;
    if (locale === null || locale === "") {
      locale = "vn";
    }
    var currCode = "VND";
    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params["vnp_Locale"] = locale;
    vnp_Params["vnp_CurrCode"] = currCode;
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = orderInfo;
    vnp_Params["vnp_OrderType"] = orderType;
    vnp_Params["vnp_Amount"] = amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;
    if (bankCode !== null && bankCode !== "") {
      vnp_Params["vnp_BankCode"] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    // res.redirect(vnpUrl)
    res.status(200).json({ vnpayPaymentUrl: vnpUrl });
  };
  vnpayIPN = async (req, res, next) => {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    var config = require("../configs/default.json");
    var secretKey = config.vnp_HashSecret;
    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  };
  vnpayReturn = async (req, res, next) => {
    var vnp_Params = req.query;

    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);

    var config = require("../configs/default.json");
    var tmnCode = config.vnp_TmnCode;
    var secretKey = config.vnp_HashSecret;

    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

      res.redirect("/");
    } else {
      res.render("success", { code: "97" });
    }
  };

  placeOrder = function (req, res, next) {
    console.log("00000000000000000000000000000");
    console.log(req.body);
    const userId = req.user._id;
    const orderData = {
      _address: req.body._address,
      _name: req.body._name,
      _phone: req.body._phone,
      _status: req.body._status,
      _totalPayment: req.body._totalPayment,
      _shippingFee: req.body._shippingFee,
      _uId: userId,
      _items: req.body._items,
    };

    orderData._items = req.body._items.map((item) => {
      return {
        itemId: item.itemId,
        quantity: item.quantity,
      };
    });
    console.log("orderData");
    console.log(orderData);

    const order = new Order(orderData);

    order
      .save()
      .then((savedOrder) => {
        console.log("savedOrder");
        console.log(savedOrder);
        const allProductPromises = savedOrder._items.map((item) => {
          return Products.findOne({ _id: item.itemId }).then((product) => {
            if (!product) {
              throw new Error("Sản phẩm không tồn tại");
            }
            product._quantity = product._quantity - item.quantity;
            return product.save();
          });
        });
        return Promise.all(allProductPromises)
          .then((data) => {
            return Cart.findOne({ uId: savedOrder._uId });
          })
          .then((cart) => {
            console.log("cart._cartItems trước khi cập nhật");

            console.log(cart._cartItems);
            savedOrder._items.forEach((savedItem) => {
              cart._cartItems = cart._cartItems.filter(
                (cartItem) => !savedItem.itemId.equals(cartItem.itemId)
              );
            });

            cart._cartItems = cart._cartItems.filter((element) => {
              const found = savedOrder._items.find((item) => {
                return item.itemId.equals(element.itemId);
              });
              return !found;
            });
            console.log("cart._cartItems sau khi cập nhật");

            console.log(cart._cartItems);
            return cart.save();
          })
          .then(() => {
            res.json(savedOrder);
          })
          .catch((err) => {
            console.error("Lỗi khi cập nhật số lượng sản phẩm:", err);
            const error = new APIError(
              err.message,
              httpStatus.INTERNAL_SERVER_ERROR,
              true
            );
            return next(error);
          });
      })
      .catch((err) => {
        console.error("Lỗi khi lưu đơn hàng:", err);
        const error = new APIError(
          err.message,
          httpStatus.INTERNAL_SERVER_ERROR,
          true
        );
        return next(error);
      });
  };
}

module.exports = new OrderController();
