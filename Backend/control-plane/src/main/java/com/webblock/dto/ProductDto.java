package com.webblock.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private UUID id;
    private UUID tenantId;
    private String title;
    private BigDecimal price;
    private String status;
    @Builder.Default
    private Map<String, Object> customFields = new HashMap<>();
}
