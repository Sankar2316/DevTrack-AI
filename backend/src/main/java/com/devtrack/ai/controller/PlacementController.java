package com.devtrack.ai.controller;

import com.devtrack.ai.model.PlacementApplication;
import com.devtrack.ai.model.User;
import com.devtrack.ai.service.PlacementService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/placement")
public class PlacementController {

    @Autowired
    private PlacementService placementService;

    @GetMapping("/applications")
    public ResponseEntity<?> getApplications(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<PlacementApplication> apps = placementService.getApplications(user.getId());
        return ResponseEntity.ok(apps);
    }

    @PostMapping("/applications")
    public ResponseEntity<?> addApplication(@AuthenticationPrincipal User user, @RequestBody ApplicationRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            PlacementApplication app = placementService.addApplication(
                    user.getId(), 
                    request.getCompanyName(), 
                    request.getStatus(), 
                    request.getAppliedDate()
            );
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @AuthenticationPrincipal User user, 
            @PathVariable Long id, 
            @RequestParam String status) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            PlacementApplication app = placementService.updateStatus(id, status);
            return ResponseEntity.ok(app);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/applications/{id}")
    public ResponseEntity<?> deleteApplication(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            placementService.deleteApplication(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class ApplicationRequest {
        private String companyName;
        private String status;
        private LocalDate appliedDate;
    }
}
