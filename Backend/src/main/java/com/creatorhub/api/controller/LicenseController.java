package com.creatorhub.api.controller;

import com.creatorhub.api.entity.LicenseEntity;
import com.creatorhub.api.entity.ProductEntity;
import com.creatorhub.api.service.LicenseService;
import com.creatorhub.api.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1.0/licenses")
@CrossOrigin(origins = "*") // CORS issues se bachne ke liye
public class LicenseController {

    @Autowired
    private LicenseService licenseService;

    // License Key ko verify karne ke liye endpoint
    @PostMapping("/verify")
    public ResponseEntity<?> verifyLicense(@RequestBody Map<String, Object> requestData) {
        try {
            if (!requestData.containsKey("licenseKey") || !requestData.containsKey("productId")) {
                Map<String, String> badRequest = new HashMap<>();
                badRequest.put("error", "licenseKey aur productId dono required hain.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(badRequest);
            }

            String licenseKey = requestData.get("licenseKey").toString();
            Long productId = Long.parseLong(requestData.get("productId").toString());

            boolean isValid = licenseService.validateLicense(licenseKey, productId);

            Map<String, Object> response = new HashMap<>();
            if (isValid) {
                response.put("valid", true);
                response.put("message", "License is valid and active.");
                return ResponseEntity.ok(response);
            } else {
                response.put("valid", false);
                response.put("message", "License is invalid, expired, or does not match this product.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "License verification ke dauran error aayi: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/users/{buyerId:.+}")
    public ResponseEntity<List<LicenseEntity>> getUserLicenses(@PathVariable String buyerId)
    {
        return ResponseEntity.ok(licenseService.getLicensesByBuyer(buyerId));
    }

}
