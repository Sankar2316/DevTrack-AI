package com.devtrack.ai.controller;

import com.devtrack.ai.model.CodingProgress;
import com.devtrack.ai.model.User;
import com.devtrack.ai.service.CodingTrackerService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coding")
public class CodingTrackerController {

    @Autowired
    private CodingTrackerService codingTrackerService;

    @GetMapping("/stats")
    public ResponseEntity<?> getCodingStats(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        CodingProgress progress = codingTrackerService.getProgress(user.getId());
        return ResponseEntity.ok(progress);
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateCodingProgress(
            @AuthenticationPrincipal User user, 
            @RequestBody CodingUpdateRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            CodingProgress progress = codingTrackerService.updateProgress(
                    user.getId(), 
                    request.getLeetcodeProblems(), 
                    request.getHackerrankProblems(),
                    request.getWeeklyGoals(),
                    request.getMonthlyGoals()
            );
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class CodingUpdateRequest {
        private int leetcodeProblems;
        private int hackerrankProblems;
        private int weeklyGoals;
        private int monthlyGoals;
    }
}
