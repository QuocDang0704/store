package com.clothes.datn.vnpay;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@Component
public class Config {
    @Value("${vnpay.pay-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnp_PayUrl;
    
    @Value("${vnpay.return-url:http://localhost:8080/api/v1/order/payment-callback}")
    private String vnp_ReturnUrl;
    
    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;
    
    @Value("${vnpay.secret-key}")
    private String secretKey;
    
    @Value("${vnpay.api-url:https://sandbox.vnpayment.vn/merchant_webapi/api/transaction}")
    private String vnp_ApiUrl;

    // Static fields để sử dụng trong static methods
    private static String staticVnp_PayUrl;
    private static String staticVnp_ReturnUrl;
    private static String staticVnp_TmnCode;
    private static String staticSecretKey;
    private static String staticVnp_ApiUrl;

    @PostConstruct
    public void init() {
        staticVnp_PayUrl = this.vnp_PayUrl;
        staticVnp_ReturnUrl = this.vnp_ReturnUrl;
        staticVnp_TmnCode = this.vnp_TmnCode;
        staticSecretKey = this.secretKey;
        staticVnp_ApiUrl = this.vnp_ApiUrl;
    }

    // Getters
    public String getVnp_PayUrl() { return vnp_PayUrl; }
    public String getVnp_ReturnUrl() { return vnp_ReturnUrl; }
    public String getVnp_TmnCode() { return vnp_TmnCode; }
    public String getSecretKey() { return secretKey; }
    public String getVnp_ApiUrl() { return vnp_ApiUrl; }

    // Static getters
    public static String getStaticVnp_PayUrl() { return staticVnp_PayUrl; }
    public static String getStaticVnp_ReturnUrl() { return staticVnp_ReturnUrl; }
    public static String getStaticVnp_TmnCode() { return staticVnp_TmnCode; }
    public static String getStaticSecretKey() { return staticSecretKey; }
    public static String getStaticVnp_ApiUrl() { return staticVnp_ApiUrl; }

    public static String md5(String message) {
        String digest = null;
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException ex) {
            digest = "";
        } catch (NoSuchAlgorithmException ex) {
            digest = "";
        }
        return digest;
    }

    public static String Sha256(String message) {
        String digest = null;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(message.getBytes("UTF-8"));
            StringBuilder sb = new StringBuilder(2 * hash.length);
            for (byte b : hash) {
                sb.append(String.format("%02x", b & 0xff));
            }
            digest = sb.toString();
        } catch (UnsupportedEncodingException ex) {
            digest = "";
        } catch (NoSuchAlgorithmException ex) {
            digest = "";
        }
        return digest;
    }

    //Util for VNPAY
    public static String hashAllFields(Map fields, String secretKey) {
        List fieldNames = new ArrayList(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                sb.append(fieldValue);
            }
            if (itr.hasNext()) {
                sb.append("&");
            }
        }
        return hmacSHA512(secretKey, sb.toString());
    }

    public static String hmacSHA512(final String key, final String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            // Sử dụng UTF-8 cho key
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            
            // Sử dụng UTF-8 cho data
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            ex.printStackTrace();
            return "";
        }
    }

    public static String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }
}
