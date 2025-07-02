package com.clothes.datn.vnpay;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequestMapping("/api/vnpay-test")
@RequiredArgsConstructor
public class VNPayTestController {
    private final VNPayService vnPayService;

    // Endpoint để tạo link thanh toán
    @GetMapping("/create-payment")
    public String createPayment(@RequestParam long price, @RequestParam Long orderId) throws UnsupportedEncodingException {
        return vnPayService.getPay(price, orderId);
    }

    // Endpoint callback nhận kết quả thanh toán từ VNPay
    @GetMapping("/callback")
    public void paymentCallback(@RequestParam Map<String, String> queryParams, HttpServletResponse response) throws IOException {
        vnPayService.paymentCallback(queryParams, response);
    }
} 