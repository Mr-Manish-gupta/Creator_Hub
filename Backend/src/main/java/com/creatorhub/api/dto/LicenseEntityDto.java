package com.creatorhub.api.dto;


import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LicenseEntityDto {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String  license;
    private Long productId;
    private String buyerId;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

}
