package com.webblock.repository;

import com.webblock.model.Website;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WebsiteRepository extends JpaRepository<Website, UUID> {
    Optional<Website> findBySubdomain(String subdomain);
    Optional<Website> findByDomainName(String domainName);
    List<Website> findByOwnerId(UUID ownerId);
    boolean existsBySubdomain(String subdomain);
}
