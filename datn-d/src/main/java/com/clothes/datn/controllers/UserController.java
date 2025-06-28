package com.clothes.datn.controllers;

import com.clothes.datn.dto.LoginDto;
import com.clothes.datn.dto.ResponseDTO;
import com.clothes.datn.dto.UserDto;
import com.clothes.datn.entities.User;
import com.clothes.datn.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/v1/user")
@Tag(name = "User", description = "Người dùng")
@CrossOrigin(origins = "*")
public class UserController {
    private final UserService userService;

    @GetMapping()
    public ResponseDTO getAll(Pageable pageable) {
        return ResponseDTO.success(this.userService.getAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseDTO getById(@PathVariable("id") Long id) {
        return ResponseDTO.success(this.userService.getById(id));
    }

    @PostMapping()
    public ResponseDTO createUser(@RequestBody User req) {
        return ResponseDTO.success(this.userService.createUser(req));
    }

    @PutMapping()
    public ResponseDTO updateUser(@RequestBody User req) {
        return ResponseDTO.success(this.userService.updateUser(req));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO deleteUser(@PathVariable("id") Long id) {
        this.userService.deleteUser(id);
        return ResponseDTO.success();
    }
//    @PostMapping("/login")
//    public ResponseDTO login(@RequestBody LoginDto loginDto) {
//        return ResponseDTO.success(this.userService.login(loginDto));
//    }

//    @PostMapping("/register")
//    public ResponseDTO register(@RequestBody UserDto userDto) {
//        return ResponseDTO.success(this.userService.registerUser(userDto));
//    }

    @GetMapping("/findByUserName")
    public ResponseDTO findByUserName(String userName) {
        return ResponseDTO.success(this.userService.findByUserName(userName));
    }

}
