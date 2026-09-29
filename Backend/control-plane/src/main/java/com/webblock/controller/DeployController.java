package com.webblock.controller;

import com.webblock.dto.DeployRequest;
import com.webblock.service.DeployService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/websites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeployController {

    private final DeployService deployService;

    @PostMapping("/{tenantId}/deploy")
    public ResponseEntity<DeployService.DeployResult> deploy(
            @PathVariable UUID tenantId,
            @RequestBody DeployRequest request) {
        DeployService.DeployResult result = deployService.triggerDeployment(tenantId, request);
        return ResponseEntity.ok(result);
    }
}
