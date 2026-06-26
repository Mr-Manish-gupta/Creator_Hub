package com.creatorhub.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
@Entity
@Data
@Table(name = "license")
public class LicenseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String  licenseKey;
    private Long productId;
    private String buyerId;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}

