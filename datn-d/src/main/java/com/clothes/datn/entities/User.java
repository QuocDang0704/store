package com.clothes.datn.entities;

import lombok.*;

import java.util.List;
import java.util.Objects;

import jakarta.persistence.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "`user`")
public class User {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "`id`")
    private Long id;

    @Column(name = "`email`")
    private String email;

    @Column(name = "`first_name`")
    private String firstName;

    @Column(name = "`last_name`")
    private String lastName;

    @Column(name = "`user_name`")
    private String userName;

    @Column(name = "`password`")
    private String password;

    @Column(name = "`gender`")
    private String gender;

    @Column(name = "`phone`")
    private String phone;

    @Column(name = "`dob`")
    private String dob;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id"))
    private List<Role> role;

    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<Address> addresses;
}
