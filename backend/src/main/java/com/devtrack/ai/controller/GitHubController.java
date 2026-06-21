package com.devtrack.ai.controller;

import com.devtrack.ai.model.GitHubStats;
import com.devtrack.ai.model.User;
import com.devtrack.ai.service.GitHubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
public class GitHubController {

    @Autowired
    private GitHubService gitHubService;

    @GetMapping("/stats")
    public ResponseEntity<?> getGitHubStats(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        GitHubStats stats = gitHubService.getStats(user.getId());
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncGitHubProfile(@AuthenticationPrincipal User user, @RequestParam String username) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            GitHubStats stats = gitHubService.syncGitHubStats(user.getId(), username);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
