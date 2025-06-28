package com.clothes.datn.dto.response;

import com.clothes.datn.dto.ProductDetailDto;
import com.clothes.datn.entities.ProductDetail;
import com.clothes.datn.entities.WarehouseEntry;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class ResWarehouseEntryDetailDto {
    private Long id;
    private ResProductDetailDto productDetail;
    private Long price;
    private Long quantity;
    private Long total;
}
