package com.devtrack.ai.controller;

import com.devtrack.ai.model.*;
import com.devtrack.ai.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private GitHubService gitHubService;

    @Autowired
    private CodingTrackerService codingTrackerService;

    @Autowired
    private PlacementService placementService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Map<String, Object> summary = new HashMap<>();

        // GitHub Stats
        GitHubStats ghStats = gitHubService.getStats(user.getId());
        summary.put("githubStats", ghStats);

        // Coding Progress
        CodingProgress codingProgress = codingTrackerService.getProgress(user.getId());
        summary.put("codingProgress", codingProgress);

        // Placement Applications
        List<PlacementApplication> applications = placementService.getApplications(user.getId());
        summary.put("totalApplications", applications.size());
        
        long activeApps = applications.stream()
                .filter(a -> a.getStatus() != PlacementStatus.SELECTED && a.getStatus() != PlacementStatus.REJECTED)
                .count();
        summary.put("activeApplications", activeApps);

        // Calculate Placement Readiness Score
        // Formula: 35% GitHub consistency + 35% coding problems + 30% applications
        int githubComponent = Math.min(35, (ghStats.getStreak() * 35) / 15);
        int codingComponent = Math.min(35, ((codingProgress.getLeetcodeProblems() + codingProgress.getHackerrankProblems()) * 35) / 150);
        int appComponent = Math.min(30, (applications.size() * 30) / 5);
        int readinessScore = Math.min(100, Math.max(35, githubComponent + codingComponent + appComponent));

        summary.put("readinessScore", readinessScore);

        // Recent Notifications
        List<Notification> recentAlerts = notificationService.getNotifications(user.getId(), false);
        summary.put("recentActivities", recentAlerts.stream().limit(5).collect(java.util.stream.Collectors.toList()));

        return ResponseEntity.ok(summary);
    }
}
