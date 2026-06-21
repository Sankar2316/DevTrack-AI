package com.devtrack.ai.controller;

import com.devtrack.ai.model.Roadmap;
import com.devtrack.ai.model.User;
import com.devtrack.ai.service.RoadmapService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/roadmaps")
public class RoadmapController {

    @Autowired
    private RoadmapService roadmapService;

    @GetMapping("/current")
    public ResponseEntity<?> getActiveRoadmap(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Optional<Roadmap> roadmapOpt = roadmapService.getActiveRoadmap(user.getId());
        if (roadmapOpt.isPresent()) {
            return ResponseEntity.ok(roadmapOpt.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/update-progress")
    public ResponseEntity<?> updateRoadmapProgress(
            @AuthenticationPrincipal User user, 
            @RequestBody RoadmapProgressUpdateRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            Roadmap updated = roadmapService.updateRoadmapProgress(
                    user.getId(), 
                    request.getGeneratedPlan(), 
                    request.getCompletionPercentage()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class RoadmapProgressUpdateRequest {
        private String generatedPlan;
        private int completionPercentage;
    }
}
