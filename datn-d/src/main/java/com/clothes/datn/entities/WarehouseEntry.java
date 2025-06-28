package com.clothes.datn.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.hibernate.annotations.CreationTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Setter
@Getter
@Table(name = "`warehouse_entry`")
public class WarehouseEntry {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "`id`")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "warehouseEntry", cascade = CascadeType.ALL)
    private List<WarehouseEntryDetail> warehouseEntryDetails;

    @Column(name = "`created_date`")
    @CreationTimestamp
    private Instant createdDate;

    @Column(name = "`updated_date`")
    @CreationTimestamp
    private Instant updatedDate;
}
