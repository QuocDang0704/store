package com.clothes.datn.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.util.Objects;

import jakarta.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Setter
@Getter
@Table(name = "`warehouse_entry_detail`")
public class WarehouseEntryDetail {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "`id`")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "warehouse_entry_id", nullable = false)
    @JsonIgnore
    private WarehouseEntry warehouseEntry;

    @ManyToOne
    @JoinColumn(name = "product_detail_id", nullable = false)
    private ProductDetail productDetail;

    @Column(name = "`price`")
    private Long price;

    @Column(name = "`quantity`")
    private Long quantity;

    @Column(name = "`total`")
    private Long total;

}
