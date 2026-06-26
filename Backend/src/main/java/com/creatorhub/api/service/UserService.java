package com.creatorhub.api.service;


import com.creatorhub.api.entity.UserEntity;
import com.creatorhub.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserEntity syncUser(String clerkId , String email, String name){
        Optional<UserEntity> existingUser = userRepository.findByClerkId(clerkId);

        if(existingUser.isPresent()){
            System.out.println("User pehle se login hai " + email);
            return existingUser.get();
        }else {
            System.out.println("User create ho rha hai" + email);
            UserEntity newUser = new UserEntity();
            newUser.setClerkId(clerkId);
            newUser.setEmail(email);
            newUser.setName(name);

            return userRepository.save(newUser);
        }
    }
}
