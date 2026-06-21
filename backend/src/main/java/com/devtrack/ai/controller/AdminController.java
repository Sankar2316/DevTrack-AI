package com.devtrack.ai.controller;

import com.devtrack.ai.model.Announcement;
import com.devtrack.ai.model.User;
import com.devtrack.ai.service.AdminService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        try {
            User user = adminService.updateUserRole(id, role);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getPlatformAnalytics() {
        Map<String, Object> analytics = adminService.getPlatformAnalytics();
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/announcements")
    public ResponseEntity<?> getAnnouncements() {
        List<Announcement> announcements = adminService.getAllAnnouncements();
        return ResponseEntity.ok(announcements);
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> createAnnouncement(@AuthenticationPrincipal User user, @RequestBody AnnouncementRequest request) {
        try {
            Announcement ann = adminService.createAnnouncement(
                    request.getTitle(), 
                    request.getContent(), 
                    user.getName()
            );
            return ResponseEntity.ok(ann);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<?> deleteAnnouncement(@PathVariable Long id) {
        try {
            adminService.deleteAnnouncement(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Data
    public static class AnnouncementRequest {
        private String title;
        private String content;
    }
}
