package com.clothes.datn.dto;

import lombok.Data;

@Data
public class FeedbackDto {
    private Long id;
    private Long userId;
    private Long productId;
    private String feedbackText;
    private Long vote;
    private java.time.LocalDateTime createdAt;
    private String userName;
} 