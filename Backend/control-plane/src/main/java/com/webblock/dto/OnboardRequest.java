package com.webblock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardRequest {
    private UUID ownerId;
    private String businessName;
    private String templateId;
    private String subdomain;
    private String domainName;
    private String contactEmail;
    private String contactPhone;
    private String contactAddress;
    
    @Builder.Default
    private List<ProductItem> products = new ArrayList<>();
    
    @Builder.Default
    private Map<String, Object> themeConfig = new HashMap<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProductItem {
        private String title;
        private BigDecimal price;
        private String description;
        private String imageUrl;
        private String badge;
        private String category;
        private Integer stock;
        @Builder.Default
        private List<String> features = new ArrayList<>();
    }
}
