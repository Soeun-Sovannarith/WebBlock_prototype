package com.webblock.controller;

import com.webblock.dto.ProductDto;
import com.webblock.model.Product;
import com.webblock.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants/{tenantId}/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(productService.getProductsByTenant(tenantId));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @PathVariable UUID tenantId,
            @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.createProduct(tenantId, dto));
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable UUID tenantId,
            @PathVariable UUID productId,
            @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.updateProduct(tenantId, productId, dto));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable UUID tenantId,
            @PathVariable UUID productId) {
        productService.deleteProduct(tenantId, productId);
        return ResponseEntity.noContent().build();
    }
}
