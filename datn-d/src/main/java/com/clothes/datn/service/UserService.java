package com.clothes.datn.service;

import com.clothes.datn.config.exception.NotFoundException;
import com.clothes.datn.dto.LoginDto;
import com.clothes.datn.dto.UserDto;
import com.clothes.datn.entities.Role;
import com.clothes.datn.entities.User;
import com.clothes.datn.repository.IRoleRepository;
import com.clothes.datn.repository.IUserRepository;
import com.clothes.datn.dto.response.JwtResponse;
import com.clothes.datn.security.JwtService;
import com.clothes.datn.security.service.UserDetailsImpl;
import com.clothes.datn.security.service.UserDetailsServiceImpl;
import com.clothes.datn.utils.MapperUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {
    private final IUserRepository userRepository;
    private final IRoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    public Page<User> getAll(Pageable pageable) {
        System.out.println(this.encoder.encode("Bernie@123"));
        return this.userRepository.findAll(pageable);
    }

    public User getById(Long id) {
        return this.userRepository.findByIdOrThrow(id);
    }
    public Optional<User> findByUserName(String userName) {
        return this.userRepository.findByUserName(userName);
    }

    public User createUser(User req) {
        Optional<User> user = this.userRepository.findByUserName(req.getUserName());
        if (user.isPresent()) {
            throw new NotFoundException("UserName " + "đã tồn tại");
        }
        List<Role> roles = req.getRole().stream().map(role -> {
            return roleRepository.findByIdOrThrow(role.getId());
        }).collect(Collectors.toList());
        req.setRole(roles);
        req.setPassword(this.encoder.encode(req.getPassword()));
        return this.userRepository.save(req);
    }

    public User updateUser(User req) {
        User user = this.userRepository.findByUserName(req.getUserName()).orElseThrow(() -> new NotFoundException("User " + "không tìm thấy"));

        return this.userRepository.save(req);
    }

    public void deleteUser(Long id) {
        this.userRepository.deleteById(id);
    }

    public JwtResponse login(LoginDto payloadLogin) {
        System.out.println(this.encoder.encode("Bernie@123"));
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        payloadLogin.getUsername(), payloadLogin.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        var jwtToken = jwtService.generateToken(userDetails);
        var refreshToken = jwtService.generateRefreshToken(userDetails);

        return JwtResponse.builder()
                .jwtToken(jwtToken)
                .refreshToken(refreshToken)
                .type("Bearer")
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .role(roles)
                .build();
    }

    public User registerUser(UserDto userDTO) {
        User user = MapperUtils.map(userDTO, User.class);
        Role role = roleRepository.findByName("CUSTOMER")
                .orElseThrow(() -> new NotFoundException("Hiện đang không có role CUSTOMER vui lòng thêm"));
        List<Role> listRoles = new ArrayList<>();
        listRoles.add(role);
        user.setPassword(this.encoder.encode(user.getPassword()));
        user.setPassword(user.getPassword());
        user.setRole(listRoles);
        return this.userRepository.save(user);
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUser = authentication.getName();
        return userRepository.findByUserName(currentUser).orElseThrow(NotFoundException::new);
    }

    public JwtResponse refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userName;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return null;
        }
        refreshToken = authHeader.substring(7);
        userName = jwtService.extractUsername(refreshToken);
        if (userName != null) {
            UserDetailsImpl user = UserDetailsImpl.build(userRepository.findByUserName(userName)
                    .orElseThrow(() -> {
                        throw new IllegalArgumentException("khong tim thay username");
                    }));
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                return JwtResponse.builder()
                        .jwtToken(accessToken)
                        .refreshToken(refreshToken)
                        .type("Bearer")
                        .build();
            }
        }
        throw new NotFoundException("Token user does not exist");
    }

}
