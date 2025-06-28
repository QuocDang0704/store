package com.clothes.datn.utils;


public class Constant {
    public static final String SUCCESS_CODE = "0";
    public static final String SUCCESS_MSG = "SUCCESS";
    public static final String FAIL_CODE = "1";
    public static final String FAIL_MSG = "FAIL";

    public enum OderStatus {
        WaitForConfirmation,  // Chờ xác nhận
        PreparingGoods, // Chuẩn bị hàng
        Delivery, // Đang giao hàng
        Success, // Thành công
        Cancel          // hủy đơn hàng
    }

    public enum PaymentMethods {
        PaymentOverVnpay,  // Thanh toán qua VNpay
        PaymentOnDelivery  // Thanh toán khi nhận hàng
    }
}
