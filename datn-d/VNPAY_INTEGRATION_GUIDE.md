# Hướng dẫn tích hợp VNPay

## 🔍 Đánh giá tích hợp hiện tại

### ✅ Những điểm tốt:
- Cấu trúc code rõ ràng, tách biệt logic VNPay
- Sử dụng HMAC-SHA512 để mã hóa
- Có endpoint callback xử lý kết quả thanh toán
- Tích hợp tốt với hệ thống đơn hàng

### 🔧 Cải thiện đã thực hiện:

#### 1. **Bảo mật cấu hình**
- Chuyển secret key và TMN code từ hardcode sang environment variables
- Sử dụng `@Value` để đọc từ `application.properties`

#### 2. **Validation chữ ký số**
- Thêm validation `vnp_SecureHash` trong callback
- Đảm bảo tính toàn vẹn dữ liệu từ VNPay
- **Sửa lỗi "Sai chữ ký"** - Đồng bộ cách tạo chữ ký số

#### 3. **Cải thiện xử lý lỗi**
- Thêm try-catch và logging
- Không xóa đơn hàng khi thanh toán thất bại, chỉ cập nhật trạng thái

#### 4. **Lấy IP thực tế**
- Sử dụng `Config.getIpAddress(request)` thay vì hardcode IP

## 🚨 Troubleshooting - Lỗi "Sai chữ ký"

### Nguyên nhân thường gặp:

1. **Không nhất quán trong cách tạo chữ ký số**
   - ✅ **Đã sửa**: Sử dụng cùng method `hashAllFields()` cho cả tạo và validate

2. **Secret key hoặc TMN code sai**
   - Kiểm tra cấu hình trong `application.properties`
   - Đảm bảo không có khoảng trắng thừa

3. **Encoding không đúng**
   - ✅ **Đã sửa**: Sử dụng UTF-8 cho HMAC-SHA512

4. **Thứ tự tham số không đúng**
   - ✅ **Đã sửa**: Sắp xếp tham số theo alphabet

### Cách debug:

1. **Sử dụng endpoint test**:
   ```
   GET /api/v1/order/test-vnpay-signature
   ```

2. **Kiểm tra logs**:
   - Bật debug logging: `logging.level.com.clothes.datn.vnpay=DEBUG`
   - Xem logs khi tạo URL thanh toán và callback

3. **So sánh chữ ký số**:
   - Chữ ký số nhận được từ VNPay
   - Chữ ký số tính toán lại trong hệ thống

### Cấu hình logging để debug:

```properties
# application.properties
logging.level.com.clothes.datn.vnpay=DEBUG
logging.level.com.clothes.datn.controllers.OrderController=DEBUG
```

## 📋 Cấu hình cần thiết

### 1. Environment Variables
Thêm vào `application.properties`:
```properties
# VNPay Configuration
vnpay.pay-url=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
vnpay.return-url=http://localhost:8080/api/v1/order/payment-callback
vnpay.tmn-code=YOUR_TMN_CODE
vnpay.secret-key=YOUR_SECRET_KEY
vnpay.api-url=https://sandbox.vnpayment.vn/merchant_webapi/api/transaction
```

### 2. Production Configuration
Cho production, sử dụng:
```properties
vnpay.pay-url=https://pay.vnpay.vn/vpcpay.html
vnpay.api-url=https://pay.vnpay.vn/merchant_webapi/api/transaction
```

## 🔐 Bảo mật

### 1. **Secret Key Management**
- **KHÔNG** commit secret key vào git
- Sử dụng environment variables hoặc secret management service
- Rotate secret key định kỳ

### 2. **Validation**
- Luôn validate chữ ký số trong callback
- Kiểm tra `vnp_ResponseCode` và `vnp_Amount`
- Log đầy đủ để audit

### 3. **HTTPS**
- Sử dụng HTTPS cho production
- Cấu hình SSL certificate đúng cách

## 🚀 Sử dụng

### 1. Tạo đơn hàng với VNPay
```java
OrderDto orderDto = new OrderDto();
orderDto.setPaymentMethods(Constant.PaymentMethods.PaymentOverVnpay);
// ... other fields

OrderResponseDto response = orderService.createOder(orderDto, request);
String paymentUrl = response.getLink(); // Redirect user to this URL
```

### 2. Xử lý callback
```java
@GetMapping("payment-callback")
public void paymentCallback(@RequestParam Map<String, String> queryParams, 
                           HttpServletRequest request,
                           HttpServletResponse response) throws IOException {
    vnPayService.paymentCallback(queryParams, request, response);
}
```

### 3. Test chữ ký số
```java
@GetMapping("/test-vnpay-signature")
public ResponseDTO testVnPaySignature() {
    vnPayService.testSignature();
    return ResponseDTO.success("Check logs for results");
}
```

## 📊 Monitoring

### 1. Logging
- Log tất cả callback từ VNPay
- Log lỗi validation và xử lý
- Monitor response time

### 2. Metrics
- Tỷ lệ thành công/thất bại
- Thời gian xử lý callback
- Số lượng giao dịch theo thời gian

## ⚠️ Lưu ý quan trọng

1. **Test Environment**: Luôn test kỹ trên sandbox trước khi deploy production
2. **Error Handling**: Xử lý tất cả exception có thể xảy ra
3. **Idempotency**: Đảm bảo callback có thể được gọi nhiều lần mà không gây lỗi
4. **Timeout**: Cấu hình timeout phù hợp cho callback
5. **Backup**: Backup dữ liệu giao dịch định kỳ

## 🔄 Quy trình thanh toán

1. User tạo đơn hàng với `PaymentOverVnpay`
2. System tạo URL thanh toán VNPay
3. User redirect đến VNPay để thanh toán
4. VNPay callback về system với kết quả
5. System validate và cập nhật trạng thái đơn hàng
6. User được redirect về trang thành công/thất bại

## 📞 Support

- VNPay Documentation: https://sandbox.vnpayment.vn/apis/docs/huong-dan-tich-hop
- VNPay Support: support@vnpay.vn
- Test Cards: Xem trong file `application.properties` 