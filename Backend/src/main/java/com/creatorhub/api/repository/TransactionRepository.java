package com.creatorhub.api.repository;

import com.creatorhub.api.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<TransactionEntity, Long> {

    List<TransactionEntity> findByBuyerId(String buyerId);
}
