package com.creatorhub.api.service;


import com.creatorhub.api.entity.TransactionEntity;
import com.creatorhub.api.repository.TransactionRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;


@Service
public class PaymentService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private LicenseService licenseService;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public String  createOrder(Double amount , String buyerId , Long productId)throws Exception{
        //key and secret ke sath razorpay ka connection
        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount" , (int)(amount * 100));

        orderRequest.put("currency" , "INR");

        //Razor ko request bheji usne hame unique id generate karke di
        Order order = client.orders.create(orderRequest);

        TransactionEntity transaction  = new TransactionEntity();
        transaction.setRazorpayOrderId(order.get("id"));
        transaction.setAmount(amount);
        transaction.setBuyerId(buyerId);
        transaction.setProductId(productId);
        transaction.setStatus("Pending");
        transaction.setTransactionDate(LocalDateTime.now());
        transactionRepository.save(transaction); // Save pending transaction to DB

        return order.get("id");
    }

    // Razorpay signature verify karne ke liye security check
    public boolean verifyPayment (String orderId , String paymentId , String signature , Long productId , String buyerId){
        try{
            String data = orderId + "|" + paymentId; // Removed extra spaces around "|"
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256"); // Corrected algorithm name
            SecretKeySpec secret_key = new
                    SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);

            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            String calculateSignature = hexString.toString();

            //agar signature match ho gaya to payment successful ho gaya
            if(calculateSignature.equals(signature)){

                //database se purani pending transaction ko dhundo
                TransactionEntity transaction =
                        transactionRepository.findByBuyerId(buyerId)
                                .stream()
                                .filter(t -> t.getRazorpayOrderId().equals(orderId))
                                .findAny()
                                .orElse(null); // Added null to orElse


                if(transaction != null) {
                    transaction.setRazorpayPaymentId(paymentId);
                    transaction.setStatus("Success");
                    transaction.setTransactionDate(LocalDateTime.now());
                    transactionRepository.save(transaction);

                    //payment hote hi license key automatic ban jayegi user ke liye
                    licenseService.generateLicense(productId, buyerId);
                    return true;
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
}
