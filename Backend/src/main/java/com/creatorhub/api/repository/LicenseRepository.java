package com.creatorhub.api.repository;

import com.creatorhub.api.entity.LicenseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LicenseRepository extends JpaRepository<LicenseEntity  , Long> {


    Optional<LicenseEntity> findByLicenseKey(String licenseKey);
    List<LicenseEntity> findByBuyerId(String buyerId);
}
