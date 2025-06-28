package com.clothes.datn.entities;

import lombok.*;

import java.util.Objects;

import jakarta.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Setter
@Getter
@Table(name = "`supplier`")
public class Supplier {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "`id`")
    private Long id;

    @Column(name = "`name`")
    private String name;

    @Column(name = "`description`")
    private String description;

    @Column(name = "`address`")
    private String address;

    @Column(name = "`email`")
    private String email;
}
