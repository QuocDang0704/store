package com.clothes.datn.dto;

import com.clothes.datn.entities.Order;
import com.clothes.datn.entities.ProductDetail;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class OrderDetailDto {
    private Long id;
    private Long orderId;
    private Long productDetailId;
    private Long price;
    private Long quantity;
    private Long totalPrice;
}
