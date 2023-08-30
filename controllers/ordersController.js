const Order = require('../models/Orders'); 
const APIError = require('../helpers/APIError');
const httpStatus = require('http-status');
const Products = require('../models/Products'); 
const Cart = require('../models/Carts');
class OrderController {
    // api/orders (get order by userId)
    getOrder = async (req, res) => {
        try {
            const { userId } = req.query;
            const order = await Order.findOne({ _uId: userId }).populate('_items.itemId'); // Sửa '_Items' thành '_items'
        
            if (!order) {
                return res.status(404).json({ message: 'Không tìm thấy đơn hàng cho user ID này.' });
            }    
            res.json(order);
        } catch (error) {
            console.error('Lỗi khi lấy thông tin đơn hàng:', error);
            res.status(500).json({ error: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng.' });
        }
    };

    
    vnpayCreatePayment = async(req, res, next)=>{
        var ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

        var config = require('config');
        var dateFormat = require('dateformat');

        
        var tmnCode = config.get('QVA40OYU');
        var secretKey = config.get('IUCIQJMAUZZCCZVJOWHRZJLYGANJNUGI');
        var vnpUrl = config.get('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
        var returnUrl = config.get('http://localhost:5000/api/orders/vnpay_return');

        var date = new Date();

        var createDate = dateFormat(date, 'yyyymmddHHmmss');
        var orderId = dateFormat(date, 'HHmmss');
        var amount = req.body.amount;
        var bankCode = req.body.bankCode;
        
        var orderInfo = req.body.orderDescription;
        var orderType = req.body.orderType;
        var locale = req.body.language;
        if(locale === null || locale === ''){
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        // vnp_Params['vnp_Merchant'] = ''
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if(bankCode !== null && bankCode !== ''){
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl)
    }
    vnpayIPN = async(req, res, next)=>{
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var config = require('config');
        var secretKey = config.get('vnp_HashSecret');
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     
        

        if(secureHash === signed){
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            res.status(200).json({RspCode: '00', Message: 'success'})
        }
        else {
            res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
        }
    }
    vnpayReturn = async(req, res, next)=>{
        var vnp_Params = req.query;

        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        var config = require('config');
        var tmnCode = config.get('vnp_TmnCode');
        var secretKey = config.get('vnp_HashSecret');

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");     
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

        if(secureHash === signed){
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            res.render('success', {code: vnp_Params['vnp_ResponseCode']})
        } else{
            res.render('success', {code: '97'})
        }
    }

    placeOrder = function (req, res, next) {
        console.log(req.body);
    
        const orderData = {
            _address: req.body._address,
            _name: req.body._name,
            _phone: req.body._phone,
            _status: req.body._status,
            _totalPayment: req.body._totalPayment,
            _shippingFee: req.body._shippingFee,
            _uId: req.body._uId
        };
    
        orderData._items = req.body._items.map(item => {
            return {
                itemId: item.itemId,
                quantity: item.quantity
            };
        });
    
        console.log(orderData);
    
        const order = new Order(orderData);
    
        order.save()
            .then(savedOrder => {
                const allProductPromises = savedOrder._items.map(item => {
                    return Products.findOne({ _id: item.itemId })
                        .then(product => {
                            if (!product) {
                                throw new Error('Sản phẩm không tồn tại');
                            }
                            console.log('Số lượng sản phẩm trước khi xóa:', product._quantity);
                            product._quantity = product._quantity - item.quantity;
                            console.log('Số lượng sản phẩm sau khi xóa:', product._quantity);
                            return product.save();
                        });
                });
                return Promise.all(allProductPromises)
                .then(data => {
                    return Cart.findOne({ uId: savedOrder._uId });
                  })
                    .then(cart => {
                        cart._cartItems = cart._cartItems.filter(element => {
                            const found = savedOrder._items.find(item => {
                                return item.itemId.equals(element.itemId);
                            });
                            return !found;
                        });
                        return cart.save();
                    })
                    .then(() => {
                        res.json(savedOrder);
                    })
                    .catch(err => {
                        console.error('Lỗi khi cập nhật số lượng sản phẩm:', err);
                        const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
                        return next(error);
                    });
            })
            .catch(err => {
                console.error('Lỗi khi lưu đơn hàng:', err);
                const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
                return next(error);
            });
    };
    
}

module.exports = new OrderController();
