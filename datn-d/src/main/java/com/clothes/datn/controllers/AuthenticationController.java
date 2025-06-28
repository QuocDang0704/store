package com.clothes.datn.controllers;

import com.clothes.datn.dto.LoginDto;
import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.dto.UserDto;
import com.clothes.datn.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth", description = "Bảo mật")
@CrossOrigin(origins = "*")
public class AuthenticationController {
    private final UserService userService;

    @PostMapping("/login")
    public ResponseDTO login(@RequestBody LoginDto loginDto) {
        return ResponseDTO.success(this.userService.login(loginDto));
    }

    @PostMapping("/refresh-token")
    public ResponseDTO refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        return ResponseDTO.success(this.userService.refreshToken(request, response));
    }

    @PostMapping("/register")
    public ResponseDTO register(@RequestBody UserDto userDto) {
        return ResponseDTO.success(this.userService.registerUser(userDto));
    }
}
