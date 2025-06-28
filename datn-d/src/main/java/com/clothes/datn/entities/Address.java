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
@Table(name = "`address`")
public class Address {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "`id`")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "`is_default`")
    private Boolean isDefault;

    @Column(name = "`district`")
    private String district;

    @Column(name = "`exact`")
    private String exact;

    @Column(name = "`province`")
    private String province;

    @Column(name = "`ward`")
    private String ward;
}
