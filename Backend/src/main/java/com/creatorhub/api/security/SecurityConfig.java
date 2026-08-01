package com.creatorhub.api.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebSecurity
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain (HttpSecurity http) throws Exception{
        http
                // custom cors rules connect karne
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
               //CRSF block disable karna
                .csrf(csrf -> csrf.disable())   // eska use ham esliye kar rahe ahi ki fornend or backend agala agal port me chal rha hai to frondend se ane wali request ko block na kare
                .authorizeHttpRequests(auth-> auth.requestMatchers
                        ("/api/v1.0/**")
                        .permitAll()   //suru hone wala patha ke sath ata hai to wo koi bhi api hit akr sktahia hai ham esme coustme bhi bana kste hai ki kon si kar skta hai ya nhi lekin hamne yaha nhi banai hai
                        .anyRequest()    // ye dusre endpoint se ata hai to use login hona jaruri hai
                        .authenticated());
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(){    //
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("https://creatorhub-share.netlify.app"));  // ye set karta hai ki fronend se ane walli requst ko ho hit kare  matlab hamre react app se ane wali request
        configuration.setAllowedMethods(Arrays.asList("GET" , "POST", "DELETE", "PUT", "OPTIONS"));    // kis tarha ki method bhej skt hai
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));  // ye auth toekns ka transfer karne ke permisson deta hai
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**" , configuration);
        return source;
    }
}

//CORS cross-origin Resource sharing
