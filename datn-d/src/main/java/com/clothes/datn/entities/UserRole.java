package com.clothes.datn.entities;

import jakarta.persistence.*;
import lombok.*;


@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
//@Entity
//@Table(name = "`user_role`")
public class UserRole {
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Id
//    @Column(name = "`id`")
//    private Long id;
//
//    @Column(name = "`role_id`")
//    private Long roleId;
//
//    @Column(name = "`user_id`")
    private Long userId;
}
