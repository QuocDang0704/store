package com.clothes.datn.controllers;

import com.clothes.datn.dto.FeedbackDto;
import com.clothes.datn.entities.Feedback;
import com.clothes.datn.service.FeedbackService;
import com.clothes.datn.service.UserService;
import com.clothes.datn.service.ProductService;
import com.clothes.datn.dto.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/feedbacks")
public class FeedbackController {
    @Autowired
    private FeedbackService feedbackService;
    @Autowired
    private UserService userService;
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseDTO getAllFeedbacks() {
        return ResponseDTO.success(feedbackService.getAllFeedbacks().stream().map(this::toDto).collect(Collectors.toList()));
    }

    @PostMapping
    public ResponseDTO createFeedback(@RequestBody FeedbackDto feedbackDto) {
        Feedback feedback = toEntity(feedbackDto);
        return ResponseDTO.success(toDto(feedbackService.createFeedback(feedback)));
    }


    @GetMapping("/product/{productId}")
    public ResponseDTO getFeedbacksByProductId(@PathVariable Long productId) {
        return ResponseDTO.success(feedbackService.getFeedbacksByProductId(productId).stream().map(this::toDto).collect(Collectors.toList()));
    }


    private FeedbackDto toDto(Feedback feedback) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setUserId(feedback.getUser().getId());
        dto.setProductId(feedback.getProductId());
        dto.setFeedbackText(feedback.getFeedbackText());
        dto.setVote(feedback.getVote());
        dto.setUserName(feedback.getUser().getUserName());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }

    private Feedback toEntity(FeedbackDto dto) {
        Feedback feedback = new Feedback();
        feedback.setId(dto.getId());
        if (dto.getUserId() != null) {
            feedback.setUser(userService.getById(dto.getUserId()));
        }
        feedback.setProductId(dto.getProductId());
        feedback.setFeedbackText(dto.getFeedbackText());
        feedback.setVote(dto.getVote());
        feedback.setCreatedAt(dto.getCreatedAt());
        return feedback;
    }
} 