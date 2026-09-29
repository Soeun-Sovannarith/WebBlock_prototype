package com.webblock.controller;

import com.webblock.dto.OnboardRequest;
import com.webblock.dto.SiteSettingUpdateRequest;
import com.webblock.dto.TenantDetailResponse;
import com.webblock.model.SiteSetting;
import com.webblock.model.Website;
import com.webblock.service.TenantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/websites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WebsiteController {

    private final TenantService tenantService;

    @PostMapping("/onboard")
    public ResponseEntity<TenantDetailResponse> onboard(@RequestBody OnboardRequest request) {
        TenantDetailResponse response = tenantService.onboardTenant(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<TenantDetailResponse> getTenantDetails(@PathVariable UUID tenantId) {
        return ResponseEntity.ok(tenantService.getTenantDetails(tenantId));
    }

    @GetMapping("/resolve")
    public ResponseEntity<TenantDetailResponse> resolveSubdomain(@RequestParam String subdomain) {
        return ResponseEntity.ok(tenantService.getTenantBySubdomain(subdomain));
    }

    @PutMapping("/{tenantId}/settings")
    public ResponseEntity<SiteSetting> updateSiteSetting(
            @PathVariable UUID tenantId,
            @RequestBody SiteSettingUpdateRequest request) {
        return ResponseEntity.ok(tenantService.updateSiteSetting(tenantId, request));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Website>> getWebsitesByOwner(@PathVariable UUID ownerId) {
        return ResponseEntity.ok(tenantService.getWebsitesByOwner(ownerId));
    }
}
