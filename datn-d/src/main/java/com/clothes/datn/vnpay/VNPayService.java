package com.clothes.datn.vnpay;

import com.clothes.datn.entities.Order;
import com.clothes.datn.repository.IOrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@AllArgsConstructor
@Slf4j
public class VNPayService {
    private IOrderRepository orderRepository;
    private Config config;

    public void paymentCallback(@RequestParam Map<String, String> queryParams, 
                               HttpServletRequest request,
                               HttpServletResponse response) throws IOException {
        try {
            String vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
            String orderId = queryParams.get("orderId");
            String vnp_SecureHash = queryParams.get("vnp_SecureHash");
            
            log.info("VNPay callback received - OrderId: {}, ResponseCode: {}", orderId, vnp_ResponseCode);
            
            if (orderId == null || orderId.isEmpty()) {
                log.error("OrderId is null or empty in callback");
                response.sendRedirect("http://localhost:3000/payment-failed");
                return;
            }
            
            // Validate signature
            if (!validateSignature(queryParams, vnp_SecureHash)) {
                log.error("Invalid signature in VNPay callback for orderId: {}", orderId);
                response.sendRedirect("http://localhost:3000/payment-failed");
                return;
            }
            
            if ("00".equals(vnp_ResponseCode)) {
                // Giao dịch thành công
                Order order = orderRepository.findByIdOrThrow(Long.valueOf(orderId));
                order.setIsPayment(true);
                orderRepository.save(order);
                log.info("Payment successful for orderId: {}", orderId);
                response.sendRedirect("http://localhost:3000/order");
            } else {
                // Giao dịch thất bại - chỉ cập nhật trạng thái, không xóa đơn hàng
                Order order = orderRepository.findByIdOrThrow(Long.valueOf(orderId));
                order.setStatus(com.clothes.datn.utils.Constant.OderStatus.Cancel);
                orderRepository.save(order);
                log.warn("Payment failed for orderId: {}, responseCode: {}", orderId, vnp_ResponseCode);
                response.sendRedirect("http://localhost:3000/payment-failed");
            }
        } catch (Exception e) {
            log.error("Error processing VNPay callback", e);
            response.sendRedirect("http://localhost:3000/payment-failed");
        }
    }
    
    private boolean validateSignature(Map<String, String> queryParams, String vnp_SecureHash) {
        try {
            // Remove vnp_SecureHash from params for validation
            Map<String, String> paramsForValidation = new HashMap<>(queryParams);
            paramsForValidation.remove("vnp_SecureHash");
            
            log.debug("Validating VNPay signature with params: {}", paramsForValidation);
            
            String calculatedHash = Config.hashAllFields(paramsForValidation, config.getSecretKey());
            boolean isValid = calculatedHash.equals(vnp_SecureHash);
            
            log.debug("VNPay signature validation - Received: {}, Calculated: {}, Valid: {}", 
                     vnp_SecureHash, calculatedHash, isValid);
            
            if (!isValid) {
                log.error("VNPay signature mismatch - Received: {}, Calculated: {}", 
                         vnp_SecureHash, calculatedHash);
            }
            
            return isValid;
        } catch (Exception e) {
            log.error("Error validating VNPay signature", e);
            return false;
        }
    }

    public String getPay(long price, Long orderId, HttpServletRequest request) throws UnsupportedEncodingException {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        long amount = price * 100;
        String bankCode = "NCB";

        String vnp_TxnRef = Config.getRandomNumber(8);
        String vnp_IpAddr = Config.getIpAddress(request);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", config.getVnp_TmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_BankCode", bankCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", config.getVnp_ReturnUrl() + "?orderId=" + orderId);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Sử dụng secret key hardcode tạm thời để test
        String secretKeyToUse = config.getSecretKey();
        if (secretKeyToUse == null || secretKeyToUse.isEmpty()) {
            secretKeyToUse = "MW0W533JYU3T3GRY62CC2JQOJYQFNGRU";
            log.warn("Config secret key is null or empty, using hardcoded key");
        }
        
        // Tạo chữ ký số từ params gốc (không URL encode)
        String vnp_SecureHash = Config.hashAllFields(vnp_Params, secretKeyToUse);
        
        // Tạo query string với URL encoding
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder query = new StringBuilder();
        StringBuilder hashDataDebug = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Tạo query string (có URL encoding)
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                }
                
                // Tạo hash data debug (không có URL encoding)
                hashDataDebug.append(fieldName);
                hashDataDebug.append("=");
                hashDataDebug.append(fieldValue);
                if (itr.hasNext()) {
                    hashDataDebug.append("&");
                }
            }
        }
        
        String queryUrl = query.toString();
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = config.getVnp_PayUrl() + "?" + queryUrl;

        log.info("Generated VNPay URL for orderId: {}", orderId);
        log.info("VNPay payment URL: {}", paymentUrl);
        log.debug("VNPay params: {}", vnp_Params);
        log.debug("VNPay hash data: {}", hashDataDebug.toString());
        log.debug("VNPay secure hash: {}", vnp_SecureHash);
        log.debug("VNPay secret key used: {}", secretKeyToUse);
        log.debug("VNPay TMN code: {}", config.getVnp_TmnCode());
        
        return paymentUrl;
    }

    /**
     * Test method để kiểm tra chữ ký số VNPay
     * Sử dụng để debug khi có lỗi "Sai chữ ký"
     */
    public void testSignature() {
        try {
            Map<String, String> testParams = new HashMap<>();
            testParams.put("vnp_Version", "2.1.0");
            testParams.put("vnp_Command", "pay");
            testParams.put("vnp_TmnCode", config.getVnp_TmnCode());
            testParams.put("vnp_Amount", "1000000");
            testParams.put("vnp_CurrCode", "VND");
            testParams.put("vnp_BankCode", "NCB");
            testParams.put("vnp_TxnRef", "12345678");
            testParams.put("vnp_OrderInfo", "Thanh toan don hang:12345678");
            testParams.put("vnp_OrderType", "other");
            testParams.put("vnp_Locale", "vn");
            testParams.put("vnp_ReturnUrl", config.getVnp_ReturnUrl());
            testParams.put("vnp_IpAddr", "127.0.0.1");
            testParams.put("vnp_CreateDate", "20231201120000");
            testParams.put("vnp_ExpireDate", "20231201121500");
            
            // Tạo hash data string
            List fieldNames = new ArrayList(testParams.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            Iterator itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) testParams.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append("=");
                    hashData.append(fieldValue);
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }
            
            String calculatedHash = Config.hashAllFields(testParams, config.getSecretKey());
            
            log.info("=== VNPay Signature Test ===");
            log.info("Secret key: {}", config.getSecretKey());
            log.info("TMN code: {}", config.getVnp_TmnCode());
            log.info("Hash data string: {}", hashData.toString());
            log.info("Calculated hash: {}", calculatedHash);
            log.info("Hash data length: {}", hashData.toString().length());
            log.info("Secret key length: {}", config.getSecretKey().length());
            log.info("==========================");
            
        } catch (Exception e) {
            log.error("Error in test signature", e);
        }
    }

    /**
     * Test với dữ liệu mẫu chính thức của VNPay
     * Dựa trên tài liệu VNPay
     */
    public void testWithOfficialSample() {
        try {
            // Dữ liệu mẫu từ tài liệu VNPay
            String testSecretKey = "MW0W533JYU3T3GRY62CC2JQOJYQFNGRU";
            String testTmnCode = "0FYSKYPQ";
            
            Map<String, String> testParams = new HashMap<>();
            testParams.put("vnp_Version", "2.1.0");
            testParams.put("vnp_Command", "pay");
            testParams.put("vnp_TmnCode", testTmnCode);
            testParams.put("vnp_Amount", "1000000");
            testParams.put("vnp_CurrCode", "VND");
            testParams.put("vnp_BankCode", "NCB");
            testParams.put("vnp_TxnRef", "12345678");
            testParams.put("vnp_OrderInfo", "Thanh toan don hang:12345678");
            testParams.put("vnp_OrderType", "other");
            testParams.put("vnp_Locale", "vn");
            testParams.put("vnp_ReturnUrl", "http://localhost:8080/api/v1/order/payment-callback");
            testParams.put("vnp_IpAddr", "127.0.0.1");
            testParams.put("vnp_CreateDate", "20231201120000");
            testParams.put("vnp_ExpireDate", "20231201121500");
            
            // Tạo hash data string
            List fieldNames = new ArrayList(testParams.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            Iterator itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) testParams.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append("=");
                    hashData.append(fieldValue);
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }
            
            String calculatedHash = Config.hashAllFields(testParams, testSecretKey);
            
            log.info("=== VNPay Official Sample Test ===");
            log.info("Test Secret key: {}", testSecretKey);
            log.info("Test TMN code: {}", testTmnCode);
            log.info("Hash data string: {}", hashData.toString());
            log.info("Calculated hash: {}", calculatedHash);
            log.info("Hash data length: {}", hashData.toString().length());
            log.info("Secret key length: {}", testSecretKey.length());
            log.info("================================");
            
            // So sánh với config hiện tại
            log.info("=== Current Config vs Test ===");
            log.info("Current Secret key: {}", config.getSecretKey());
            log.info("Current TMN code: {}", config.getVnp_TmnCode());
            log.info("Secret keys match: {}", config.getSecretKey().equals(testSecretKey));
            log.info("TMN codes match: {}", config.getVnp_TmnCode().equals(testTmnCode));
            log.info("=============================");
            
        } catch (Exception e) {
            log.error("Error in official sample test", e);
        }
    }

    /**
     * Test mô phỏng chính xác quá trình tạo đơn hàng với VNPay
     */
    public void testOrderCreation() {
        try {
            // Mô phỏng dữ liệu đơn hàng thực tế
            long price = 100000; // 100,000 VND
            Long orderId = 123L;
            
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String orderType = "other";
            long amount = price * 100; // 10,000,000 (VNPay yêu cầu nhân 100)
            String bankCode = "NCB";

            String vnp_TxnRef = Config.getRandomNumber(8);
            String vnp_IpAddr = "127.0.0.1";

            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", config.getVnp_TmnCode());
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_BankCode", bankCode);
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:" + vnp_TxnRef);
            vnp_Params.put("vnp_OrderType", orderType);
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", config.getVnp_ReturnUrl() + "?orderId=" + orderId);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // Tạo chữ ký số
            String vnp_SecureHash = Config.hashAllFields(vnp_Params, config.getSecretKey());
            
            // Tạo query string
            List fieldNames = new ArrayList(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder query = new StringBuilder();
            StringBuilder hashDataDebug = new StringBuilder();
            Iterator itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    // Tạo query string (có URL encoding)
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                    }
                    
                    // Tạo hash data debug (không có URL encoding)
                    hashDataDebug.append(fieldName);
                    hashDataDebug.append("=");
                    hashDataDebug.append(fieldValue);
                    if (itr.hasNext()) {
                        hashDataDebug.append("&");
                    }
                }
            }
            
            String queryUrl = query.toString();
            queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
            String paymentUrl = config.getVnp_PayUrl() + "?" + queryUrl;

            log.info("=== VNPay Order Creation Test ===");
            log.info("Order ID: {}", orderId);
            log.info("Price: {} VND", price);
            log.info("Amount (VNPay): {} (price * 100)", amount);
            log.info("TXN Ref: {}", vnp_TxnRef);
            log.info("Create Date: {}", vnp_CreateDate);
            log.info("Expire Date: {}", vnp_ExpireDate);
            log.info("Return URL: {}", config.getVnp_ReturnUrl() + "?orderId=" + orderId);
            log.info("Hash data: {}", hashDataDebug.toString());
            log.info("Secure hash: {}", vnp_SecureHash);
            log.info("Payment URL: {}", paymentUrl);
            log.info("================================");
            
        } catch (Exception e) {
            log.error("Error in order creation test", e);
        }
    }

    /**
     * Test tạo URL thanh toán mới với thời gian hiện tại
     */
    public void testNewPaymentUrl() {
        try {
            // Tạo URL thanh toán mới
            long price = 100000; // 100,000 VND
            Long orderId = 123L;
            
            String paymentUrl = getPay(price, orderId, null);
            
            log.info("=== New Payment URL Test ===");
            log.info("Price: {} VND", price);
            log.info("Order ID: {}", orderId);
            log.info("Payment URL: {}", paymentUrl);
            log.info("===========================");
            
        } catch (Exception e) {
            log.error("Error in new payment URL test", e);
        }
    }

    /**
     * Test debug chi tiết vấn đề chữ ký số bị cắt ngắn
     */
    public void testDebugShortSignature() {
        try {
            // Tạo thời gian hiện tại
            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnp_CreateDate = formatter.format(cld.getTime());
            
            cld.add(Calendar.MINUTE, 15);
            String vnp_ExpireDate = formatter.format(cld.getTime());
            
            // Tái tạo chính xác các tham số từ URL lỗi
            Map<String, String> vnp_Params = new HashMap<>();
            vnp_Params.put("vnp_Amount", "10000000");
            vnp_Params.put("vnp_BankCode", "NCB");
            vnp_Params.put("vnp_Command", "pay");
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_CurrCode", "VND");
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);
            vnp_Params.put("vnp_IpAddr", "127.0.0.1");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang:25477181");
            vnp_Params.put("vnp_OrderType", "other");
            vnp_Params.put("vnp_ReturnUrl", "http://localhost:8080/api/v1/order/payment-callback?orderId=123");
            vnp_Params.put("vnp_TmnCode", "0FYSKYPQ");
            vnp_Params.put("vnp_TxnRef", "25477181");
            vnp_Params.put("vnp_Version", "2.1.0");
            
            // Tạo hash data string
            List fieldNames = new ArrayList(vnp_Params.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            Iterator itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = (String) itr.next();
                String fieldValue = (String) vnp_Params.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append("=");
                    hashData.append(fieldValue);
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }
            
            log.info("=== Debug Short Signature ===");
            log.info("Secret key: '{}'", config.getSecretKey());
            log.info("Secret key length: {}", config.getSecretKey() != null ? config.getSecretKey().length() : "NULL");
            log.info("Secret key is empty: {}", config.getSecretKey() != null ? config.getSecretKey().isEmpty() : "NULL");
            log.info("TMN code: '{}'", config.getVnp_TmnCode());
            log.info("Hash data: '{}'", hashData.toString());
            log.info("Hash data length: {}", hashData.toString().length());
            
            // Test HMAC-SHA512 trực tiếp
            String directHash = Config.hmacSHA512(config.getSecretKey(), hashData.toString());
            log.info("Direct HMAC-SHA512: '{}'", directHash);
            log.info("Direct hash length: {}", directHash != null ? directHash.length() : "NULL");
            
            // Test hashAllFields
            String calculatedHash = Config.hashAllFields(vnp_Params, config.getSecretKey());
            log.info("hashAllFields result: '{}'", calculatedHash);
            log.info("hashAllFields length: {}", calculatedHash != null ? calculatedHash.length() : "NULL");
            
            // Test với secret key hardcode
            String hardcodedSecretKey = "MW0W533JYU3T3GRY62CC2JQOJYQFNGRU";
            String hardcodedHash = Config.hmacSHA512(hardcodedSecretKey, hashData.toString());
            log.info("Hardcoded secret key hash: '{}'", hardcodedHash);
            log.info("Hardcoded hash length: {}", hardcodedHash != null ? hardcodedHash.length() : "NULL");
            
            log.info("===========================");
            
        } catch (Exception e) {
            log.error("Error in debug short signature", e);
        }
    }
}
