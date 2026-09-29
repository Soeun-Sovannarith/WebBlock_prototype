package com.webblock.service;

import com.webblock.dto.ProductDto;
import com.webblock.model.Product;
import com.webblock.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<Product> getProductsByTenant(UUID tenantId) {
        return productRepository.findByTenantId(tenantId);
    }

    @Transactional
    public Product createProduct(UUID tenantId, ProductDto dto) {
        Product product = Product.builder()
                .tenantId(tenantId)
                .title(dto.getTitle() != null ? dto.getTitle() : "New Product")
                .price(dto.getPrice())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .customFields(dto.getCustomFields())
                .build();
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(UUID tenantId, UUID productId, ProductDto dto) {
        Product product = productRepository.findByIdAndTenantId(productId, tenantId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId + " for tenant: " + tenantId));

        if (dto.getTitle() != null) product.setTitle(dto.getTitle());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStatus() != null) product.setStatus(dto.getStatus());
        if (dto.getCustomFields() != null) product.setCustomFields(dto.getCustomFields());

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(UUID tenantId, UUID productId) {
        productRepository.deleteByIdAndTenantId(productId, tenantId);
    }
}
