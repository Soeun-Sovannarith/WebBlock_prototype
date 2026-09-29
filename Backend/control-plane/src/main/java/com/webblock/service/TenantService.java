package com.webblock.service;

import com.webblock.dto.OnboardRequest;
import com.webblock.dto.SiteSettingUpdateRequest;
import com.webblock.dto.TenantDetailResponse;
import com.webblock.model.PlatformUser;
import com.webblock.model.Product;
import com.webblock.model.SiteSetting;
import com.webblock.model.Website;
import com.webblock.repository.PlatformUserRepository;
import com.webblock.repository.ProductRepository;
import com.webblock.repository.SiteSettingRepository;
import com.webblock.repository.WebsiteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class TenantService {

    private final PlatformUserRepository platformUserRepository;
    private final WebsiteRepository websiteRepository;
    private final SiteSettingRepository siteSettingRepository;
    private final ProductRepository productRepository;
    private final GitHubRepoService gitHubRepoService;

    @Transactional
    public TenantDetailResponse onboardTenant(OnboardRequest request) {
        log.info("Onboarding new tenant for business: {}", request.getBusinessName());

        // 1. Get or create platform user
        PlatformUser owner = null;
        if (request.getOwnerId() != null) {
            owner = platformUserRepository.findById(request.getOwnerId()).orElse(null);
        }
        if (owner == null) {
            String email = request.getContactEmail();
            if (email == null || email.isBlank()) {
                email = "demo-" + UUID.randomUUID().toString().substring(0, 8) + "@webblock.io";
            }
            final String finalEmail = email;
            owner = platformUserRepository.findByEmail(finalEmail)
                    .orElseGet(() -> platformUserRepository.save(PlatformUser.builder()
                            .email(finalEmail)
                            .passwordHash("auto_generated_hash")
                            .build()));
        }

        // 2. Generate clean subdomain
        String subdomain = request.getSubdomain();
        if (subdomain == null || subdomain.isBlank()) {
            subdomain = slugify(request.getBusinessName());
        }
        subdomain = ensureUniqueSubdomain(subdomain);

        // 3. Create Website entity
        Website website = Website.builder()
                .owner(owner)
                .domainName(request.getDomainName())
                .subdomain(subdomain)
                .status("DRAFT")
                .build();
        website = websiteRepository.save(website);

        // 4. Create SiteSetting entity
        Map<String, Object> themeConfig = request.getThemeConfig() != null ? new HashMap<>(request.getThemeConfig()) : new HashMap<>();
        themeConfig.putIfAbsent("businessName", request.getBusinessName());
        themeConfig.putIfAbsent("templateId", request.getTemplateId() != null ? request.getTemplateId() : "tech-store");
        themeConfig.putIfAbsent("contactEmail", request.getContactEmail());
        themeConfig.putIfAbsent("contactPhone", request.getContactPhone());
        themeConfig.putIfAbsent("contactAddress", request.getContactAddress());

        SiteSetting siteSetting = SiteSetting.builder()
                .tenantId(website.getTenantId())
                .themeConfig(themeConfig)
                .allowedCustomFields(new ArrayList<>())
                .build();
        siteSetting = siteSettingRepository.save(siteSetting);

        // 5. Create initial products
        List<Product> savedProducts = new ArrayList<>();
        if (request.getProducts() != null && !request.getProducts().isEmpty()) {
            for (OnboardRequest.ProductItem item : request.getProducts()) {
                Map<String, Object> customFields = new HashMap<>();
                if (item.getDescription() != null) customFields.put("description", item.getDescription());
                if (item.getImageUrl() != null) customFields.put("imageUrl", item.getImageUrl());
                if (item.getBadge() != null) customFields.put("badge", item.getBadge());
                if (item.getCategory() != null) customFields.put("category", item.getCategory());
                if (item.getStock() != null) customFields.put("stock", item.getStock());
                if (item.getFeatures() != null) customFields.put("features", item.getFeatures());

                Product prod = Product.builder()
                        .tenantId(website.getTenantId())
                        .title(item.getTitle() != null ? item.getTitle() : "Untitled Product")
                        .price(item.getPrice() != null ? item.getPrice() : BigDecimal.ZERO)
                        .status("ACTIVE")
                        .customFields(customFields)
                        .build();
                savedProducts.add(productRepository.save(prod));
            }
        }

        // 6. Push frontend + backend (NextJS + Prisma) to GitHub repository
        String githubRepoUrl = gitHubRepoService.createAndPushTenantRepo(website, siteSetting, savedProducts);

        return TenantDetailResponse.builder()
                .website(website)
                .siteSetting(siteSetting)
                .products(savedProducts)
                .githubRepoUrl(githubRepoUrl)
                .build();
    }

    @Transactional(readOnly = true)
    public TenantDetailResponse getTenantDetails(UUID tenantId) {
        Website website = websiteRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant website not found with ID: " + tenantId));
        SiteSetting siteSetting = siteSettingRepository.findByTenantId(tenantId)
                .orElse(SiteSetting.builder().tenantId(tenantId).build());
        List<Product> products = productRepository.findByTenantId(tenantId);
        String org = "WebBlock-Organization";
        String githubRepoUrl = "https://github.com/" + org + "/" + website.getSubdomain() + "-store";

        return TenantDetailResponse.builder()
                .website(website)
                .siteSetting(siteSetting)
                .products(products)
                .githubRepoUrl(githubRepoUrl)
                .build();
    }

    @Transactional(readOnly = true)
    public TenantDetailResponse getTenantBySubdomain(String subdomain) {
        Website website = websiteRepository.findBySubdomain(subdomain)
                .orElseThrow(() -> new RuntimeException("Website not found for subdomain: " + subdomain));
        SiteSetting siteSetting = siteSettingRepository.findByTenantId(website.getTenantId())
                .orElse(SiteSetting.builder().tenantId(website.getTenantId()).build());
        List<Product> products = productRepository.findByTenantIdAndStatus(website.getTenantId(), "ACTIVE");

        return TenantDetailResponse.builder()
                .website(website)
                .siteSetting(siteSetting)
                .products(products)
                .build();
    }

    @Transactional
    public SiteSetting updateSiteSetting(UUID tenantId, SiteSettingUpdateRequest request) {
        SiteSetting setting = siteSettingRepository.findByTenantId(tenantId)
                .orElseGet(() -> SiteSetting.builder().tenantId(tenantId).build());

        if (request.getThemeConfig() != null) {
            setting.setThemeConfig(request.getThemeConfig());
        }
        if (request.getAllowedCustomFields() != null) {
            setting.setAllowedCustomFields(request.getAllowedCustomFields());
        }

        return siteSettingRepository.save(setting);
    }

    @Transactional
    public Website updateDomainAndStatus(UUID tenantId, String domainName, String subdomain, String status) {
        Website website = websiteRepository.findById(tenantId)
                .orElseThrow(() -> new RuntimeException("Tenant website not found with ID: " + tenantId));

        if (domainName != null) website.setDomainName(domainName);
        if (subdomain != null && !subdomain.isBlank() && !subdomain.equals(website.getSubdomain())) {
            website.setSubdomain(ensureUniqueSubdomain(subdomain));
        }
        if (status != null) website.setStatus(status);

        return websiteRepository.save(website);
    }

    @Transactional(readOnly = true)
    public List<Website> getWebsitesByOwner(UUID ownerId) {
        return websiteRepository.findByOwnerId(ownerId);
    }

    private String slugify(String input) {
        if (input == null || input.isBlank()) return "store-" + UUID.randomUUID().toString().substring(0, 6);
        String slug = input.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-");
        if (slug.startsWith("-")) slug = slug.substring(1);
        if (slug.endsWith("-")) slug = slug.substring(0, slug.length() - 1);
        return slug.isBlank() ? "store-" + UUID.randomUUID().toString().substring(0, 6) : slug;
    }

    private String ensureUniqueSubdomain(String baseSubdomain) {
        String test = baseSubdomain;
        int count = 1;
        while (websiteRepository.existsBySubdomain(test)) {
            test = baseSubdomain + "-" + count;
            count++;
        }
        return test;
    }
}
