package com.creatorhub.api.controller;


import com.creatorhub.api.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/v1.0/payments")
@CrossOrigin(origins = "*") //cors issues se bachne ke liye
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String , Object> requestData){
        try{
            Double amount = Double.parseDouble(requestData.get("amount").toString());
            String buyerId = requestData.get("buyerId").toString();
            Long productId = Long.parseLong(requestData.get("productId").toString());

            String orderId = paymentService.createOrder(amount, buyerId , productId);
            return  ResponseEntity.ok(Map.of("orderId" , orderId));
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error creating razorPay order :" +e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("verify")
    public ResponseEntity<?> verifyPayment (@RequestBody Map<String  , Object> requestData){
        try {
            // Safe checking for keys to prevent NullPointerException
            String orderId = getMapValue(requestData, "razorpay_order_id", "orderId");
            String paymentId = getMapValue(requestData, "razorpay_payment_id", "paymentId");
            String signature = getMapValue(requestData, "razorpay_signature", "signature");
            String productIdStr = getMapValue(requestData, "ProductId", "productId");
            String buyerId = getMapValue(requestData, "buyerId", null);

            if (orderId == null || paymentId == null || signature == null || productIdStr == null || buyerId == null) {
                return new ResponseEntity<>(Map.of("success", false, "message", "Missing required parameters."), org.springframework.http.HttpStatus.BAD_REQUEST);
            }

            Long productId = Long.parseLong(productIdStr);

            boolean isValid = paymentService.verifyPayment(orderId, paymentId, signature, productId , buyerId);

            if (isValid) {
                return ResponseEntity.ok(Map.of("success" , true , "message", "Payment verified successfully."));
            } else {
                return new ResponseEntity<>(Map.of("success" , false , "message" , "Invalid payment signature."), org.springframework.http.HttpStatus.BAD_REQUEST);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Payment verification failed : "+ e.getMessage(), org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Helper method to extract maps keys safely
    private String getMapValue(Map<String, Object> map, String key1, String key2) {
        if (map.containsKey(key1) && map.get(key1) != null) {
            return map.get(key1).toString();
        }
        if (key2 != null && map.containsKey(key2) && map.get(key2) != null) {
            return map.get(key2).toString();
        }
        return null;
    }}
