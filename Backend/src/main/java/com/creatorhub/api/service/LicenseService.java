package com.creatorhub.api.service;


import com.creatorhub.api.entity.LicenseEntity;
import com.creatorhub.api.entity.ProductEntity;
import com.creatorhub.api.repository.LicenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service

public class LicenseService {

    @Autowired
    private LicenseRepository licenseRepository;

    @Autowired

    private ProductService productService;

    public LicenseEntity generateLicense(Long productId, String buyerId){
        String rawKey = UUID.randomUUID().toString().substring(0,8).toUpperCase();
        String licenseKey = "CH-" + rawKey.substring(0,4)+ "-" + rawKey.substring(4,8);


        LicenseEntity license = new LicenseEntity();
        license.setLicenseKey(licenseKey);
        license.setProductId(productId);
        license.setBuyerId(buyerId);
        license.setActive(true);
        license.setCreatedAt(LocalDateTime.now());
        license.setExpiresAt(LocalDateTime.now().plusYears(1)); // 1 saal ki validity

        return licenseRepository.save(license);
    }

    // License key ko validate karne ke liye method
    public boolean validateLicense(String licenseKey, Long productId) {
        return licenseRepository.findByLicenseKey(licenseKey)
                .map(license -> license.isActive() 
                        && license.getProductId().equals(productId) 
                        && license.getExpiresAt().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    public List<LicenseEntity> getLicensesByBuyer(String buyerId) {
        return licenseRepository.findByBuyerId(buyerId);
    }

}
