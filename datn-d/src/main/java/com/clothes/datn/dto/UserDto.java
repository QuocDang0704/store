package com.clothes.datn.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class UserDto {
    private String email;
    private String firstName;
    private String lastName;
    private String userName;
    private String password;
    private String gender;
    private String phone;
    private String dob;
}
