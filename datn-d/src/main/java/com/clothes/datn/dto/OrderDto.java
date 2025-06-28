package com.clothes.datn.dto;

import com.clothes.datn.utils.Constant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderDto {
    private Long id;
    private Long voucherId;
    private Long total;
    private Long totalInit;
    private Constant.PaymentMethods paymentMethods;
    private Long shipPrice;
    private String description;
    private String address;
    private String phone;
    private String name;
    private List<OrderDetailDto> orderDetailDtos;
}
