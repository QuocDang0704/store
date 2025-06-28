package com.clothes.datn.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import com.clothes.datn.utils.Constant;

import jakarta.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Setter
@Getter
@Table(name = "`order`")
public class Order {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "`id`")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "`code`")
    private String code;

    @Column(name = "`is_payment`")
    private Boolean isPayment;

    @Column(name = "`payment_methods`")
    private Constant.PaymentMethods paymentMethods;

    @Column(name = "`total`")
    private Long total;

    @Column(name = "`total_init`")
    private Long totalInit;

    @Column(name = "`status`")
    private Constant.OderStatus status;

    @Column(name = "`ship_price`")
    private Long shipPrice;

    @Column(name = "`description`")
    private String description;

    @Column(name = "`address`")
    private String address;

    @Column(name = "`phone`")
    private String phone;

    @Column(name = "`name`")
    private String name;

    @Column(name = "`created_date`")
    @CreationTimestamp
    private Instant createdDate;

    @Column(name = "`updated_date`")
    @UpdateTimestamp
    private Instant updatedDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderDetail> orderDetails;
}
