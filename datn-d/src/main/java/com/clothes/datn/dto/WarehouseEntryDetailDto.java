package com.clothes.datn.dto;

import com.clothes.datn.entities.ProductDetail;
import com.clothes.datn.entities.WarehouseEntry;
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
public class WarehouseEntryDetailDto {
    private Long id;
    private Long productDetailId;
    private Long price;
    private Long quantity;
    private Long total;
}
