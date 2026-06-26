package com.creatorhub.api.controller;


import com.creatorhub.api.entity.UserEntity;
import com.creatorhub.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.awt.*;
import java.util.Map;

@Controller
@RequestMapping("/api/v1.0/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired  // muchhe ese class ka object auto link / auto inject chhaiey
    private UserService userService;


    @PostMapping("/sync")   // jab frontend se post request ayegi
    public ResponseEntity <?> syncClerkUser (@RequestBody Map<String, String> requestData){   // responseEntity ka matlab hia server error ki kis tarha ki errro aa rhaihai  jese ki 200 / 500 ? matlab hia ki ham reponse kuchh bhi return kar skte hia jese error a message
// Map autometically ek java Map ko Key-value paris me convert kar deta hai
        try{
            String clerkId = requestData.get("clerkId");   //JSON keys (clerkId, email, name) ke data ko extract karke simple String variables mein save kiya.
            String email = requestData.get("email");
            String name = requestData.get("name");

            if(clerkId == null || email == null || name == null ){
                System.out.println("Please fill tha All section");
            }

            UserEntity syncedUser = userService.syncUser(clerkId, email, name);   // check this user are exist are not
            return ResponseEntity.ok(syncedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("User sync error" + e.getMessage());
        }
    }
}
