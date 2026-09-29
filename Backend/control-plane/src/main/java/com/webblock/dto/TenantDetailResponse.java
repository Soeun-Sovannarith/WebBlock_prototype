package com.webblock.dto;

import com.webblock.model.Product;
import com.webblock.model.SiteSetting;
import com.webblock.model.Website;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TenantDetailResponse {
    private Website website;
    private SiteSetting siteSetting;
    private List<Product> products;
    private String githubRepoUrl;
}
