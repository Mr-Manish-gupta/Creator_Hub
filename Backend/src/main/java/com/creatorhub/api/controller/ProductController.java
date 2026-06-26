package com.creatorhub.api.controller;

import com.creatorhub.api.entity.ProductEntity;
import com.creatorhub.api.service.ProductService;
import com.creatorhub.api.service.LicenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/v1.0/products")
@CrossOrigin(origins = "*") // CORS ko handle karne ke liye
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private LicenseService licenseService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProduct(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("creatorId") String creatorId,
            @RequestParam("file") MultipartFile file) {

        try {
            ProductEntity savedProduct = productService.saveProduct(title, description, price, creatorId, file);
            return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload product: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<ProductEntity>> getAllProduct(){
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<ProductEntity>> getCreatorProduct(@PathVariable String creatorId){
        return ResponseEntity.ok(productService.getProductsByCreator(creatorId));
    }

    @GetMapping("/download/{productId}")
    public ResponseEntity<?> downloadProduct(
            @PathVariable Long productId,
            @RequestParam("buyerId") String buyerId) {
        try {
            boolean hasLicense = licenseService.getLicensesByBuyer(buyerId).stream()
                    .anyMatch(license -> license.isActive()
                            && license.getProductId().equals(productId)
                            && license.getExpiresAt().isAfter(java.time.LocalDateTime.now()));

            if (!hasLicense) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Access Denied: You do not own a valid license for this product.");
            }

            ProductEntity product = productService.getProductById(productId);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Product not found.");
            }

            java.nio.file.Path filePath = java.nio.file.Paths.get(product.getFileLocation()).toAbsolutePath().normalize();
            if (!java.nio.file.Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Physical file not found on the server.");
            }

            Resource resource = new UrlResource(filePath.toUri());

            String contentType = "application/octet-stream";
            try {
                contentType = java.nio.file.Files.probeContentType(filePath);
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }
            } catch (Exception ex) {
                // fallback
            }

            String fileName = filePath.getFileName().toString();
            if (fileName.contains("_")) {
                fileName = fileName.substring(fileName.indexOf("_") + 1);
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error downloading file: " + e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id, @RequestBody Map<String, Object> requestData){
                try{
                    String title = requestData.get("title").toString();
                    String description = requestData.get("description") != null ? requestData.get("description").toString() : "";
                    Double price = Double.parseDouble(requestData.get("price").toString());
                    ProductEntity updateProduct = productService.updateProduct(id, title, description,price);

                    if(updateProduct != null){
                        return  ResponseEntity.ok(updateProduct);
                    }else {
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                            "Failed to update." +e.getMessage()
                    );
                }
    }
}