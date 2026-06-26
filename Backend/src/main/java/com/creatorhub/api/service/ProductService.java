package com.creatorhub.api.service;

import com.creatorhub.api.entity.ProductEntity;
import com.creatorhub.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // server par upload folder par name set karein
    private final String uploadDir = "uploads";

    //Save product
    public ProductEntity saveProduct(String title, String description, Double price, String creatorId, MultipartFile file)throws IOException{

        // ager file path database me exite nhi karti hai to upload kar do
        Path uploadPath = Paths.get(uploadDir);
        if(!Files.exists(uploadPath)){
            Files.createDirectories(uploadPath);
        }

        // File name ko unique banauye taaki dublicate files replasce na ho
        String uniqueFileName = UUID.randomUUID().toString() + "_" +file.getOriginalFilename();

        Path filePath = uploadPath.resolve(uniqueFileName);


        //file server disk me copy
        Files.copy(file.getInputStream(),filePath, StandardCopyOption.REPLACE_EXISTING);

        //product details or file path ko database ke sath bind karna
        ProductEntity product = new ProductEntity();
        product.setTitle(title);
        product.setDescription(description);
        product.setPrice(price);
        product.setCreatorId(creatorId);
        product.setFileLocation(filePath.toString());
        product.setUploadedAt(LocalDateTime.now());

        //save on database
        return productRepository.save(product);
    }


    // Sabhi pruduct ko show karna
    public List<ProductEntity> getAllProducts(){
        return productRepository.findAll();
    }


    // Ek specific creatorid ke product ko show karna
    public List<ProductEntity> getProductsByCreator(String creatorId){
        return productRepository.findByCreatorId(creatorId);
    }

     // ager product id ya product hi exist nhi karta hia to null kar do
    public ProductEntity getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }



    //Updating tha product  method
    public ProductEntity updateProduct(Long id , String title, String description , Double price){
            return productRepository.findById(id)
                    .map(product -> {
                        product.setTitle(title);
                        product.setDescription(description);
                        product.setPrice(price);
                        return productRepository.save(product);
                            })
                    .orElse(null);
    }

}
