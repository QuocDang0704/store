package com.clothes.datn.dto.response;

import com.clothes.datn.entities.OrderDetail;
import com.clothes.datn.entities.User;
import com.clothes.datn.utils.Constant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class OrderResponseDto {
    private Long id;
    private User user;
    private String code;
    private Boolean isPayment;
    private Constant.PaymentMethods paymentMethods;
    private Long total;
    private Long totalInit;
    private Constant.OderStatus status;
    private Long shipPrice;
    private String description;
    private String adress;
    private String phone;
    private String name;
    private List<OrderDetail> orderDetails;
    private String link;
}
