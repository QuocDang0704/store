# Hướng dẫn Test VNPay - Debug lỗi "Sai chữ ký"

## 🎉 **TIN TỐT: Lỗi chữ ký số đã được sửa thành công!**

### ✅ **Kết quả:**
- **Lỗi "Invalid signature" (code=70)** → **Đã sửa thành công**
- **Lỗi hiện tại: "Transaction time expired" (code=15)** → **Chỉ là vấn đề thời gian**

### 🔍 **Phân tích:**
- Chữ ký số đã đúng và được VNPay chấp nhận
- Vấn đề bây giờ chỉ là thời gian giao dịch đã hết hạn (15 phút)

## 🚀 **Các bước test hiện tại**

### 1. Test tạo URL thanh toán mới:
```bash
GET http://localhost:8080/api/v1/order/test-vnpay-new-url
```

### 2. Test với thời gian hiện tại:
```bash
GET http://localhost:8080/api/v1/order/test-vnpay-exact-url
```

### 3. Test API tạo đơn hàng thực tế:
```bash
POST http://localhost:8080/api/v1/order
Content-Type: application/json

{
  "voucherId": null,
  "total": 100000,
  "totalInit": 100000,
  "paymentMethods": "PaymentOverVnpay",
  "shipPrice": 30000,
  "description": "Test order with VNPay",
  "address": "123 Test Street, Hanoi",
  "phone": "0123456789",
  "name": "Test User",
  "orderDetailDtos": [
    {
      "productDetailId": 1,
      "price": 50000,
      "quantity": 2,
      "totalPrice": 100000
    }
  ]
}
```

## 📊 Kiểm tra logs

### 1. Bật debug logging
Đã bật trong `application.properties`:
```properties
logging.level.com.clothes.datn.vnpay=DEBUG
logging.level.com.clothes.datn.controllers.OrderController=DEBUG
```

### 2. Các thông tin cần kiểm tra trong logs:

#### Khi tạo đơn hàng:
- `VNPay params`: Tất cả tham số gửi cho VNPay
- `VNPay hash data`: Chuỗi dữ liệu để tạo chữ ký số
- `VNPay secure hash`: Chữ ký số được tạo
- `VNPay payment URL`: URL thanh toán cuối cùng

#### Khi test:
- `Secret key`: Khóa bí mật
- `TMN code`: Mã merchant
- `Hash data string`: Chuỗi dữ liệu
- `Calculated hash`: Chữ ký số tính toán

## 🔧 Các vấn đề đã được sửa

### ✅ **Đã sửa:**
1. **Chữ ký số không đúng** → Đã sửa bằng cách đồng bộ hóa cách tạo chữ ký số
2. **Config injection** → Đã sửa bằng cách sử dụng @PostConstruct
3. **Encoding không đúng** → Đã sửa sử dụng UTF-8

### ⚠️ **Vấn đề hiện tại:**
1. **Thời gian giao dịch hết hạn** → URL thanh toán có thời hạn 15 phút

## 🎯 Cách test hiệu quả

### 1. Chạy test theo thứ tự:
```bash
# 1. Test tạo URL mới
GET /api/v1/order/test-vnpay-new-url

# 2. Test với thời gian hiện tại
GET /api/v1/order/test-vnpay-exact-url

# 3. Test tạo đơn hàng thực tế
POST /api/v1/order
```

### 2. Kiểm tra URL thanh toán:
- Copy URL từ logs và mở trong browser ngay lập tức
- URL có thời hạn 15 phút, không nên để quá lâu

### 3. Test thanh toán:
- Sử dụng thẻ test trong `application.properties`
- Ngân hàng: NCB, Số thẻ: 9704198526191432198

## 📞 Thông tin liên hệ

- **VNPay Support**: support@vnpay.vn
- **VNPay Hotline**: 1900.5555.77
- **VNPay Documentation**: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop

## 🔄 Quy trình debug

1. **Chạy test tạo URL mới** → Lấy URL với thời gian hiện tại
2. **Mở URL ngay lập tức** → Không để quá 15 phút
3. **Test thanh toán** → Sử dụng thẻ test
4. **Kiểm tra callback** → Xem kết quả thanh toán

## ⚠️ Lưu ý quan trọng

- **Thời gian giao dịch**: URL thanh toán có thời hạn 15 phút
- **Sandbox Environment**: Đang sử dụng sandbox VNPay
- **Test Cards**: Sử dụng thẻ test trong `application.properties`
- **IP Address**: Đảm bảo IP được VNPay chấp nhận 