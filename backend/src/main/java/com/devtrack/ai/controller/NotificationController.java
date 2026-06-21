package com.devtrack.ai.controller;

import com.devtrack.ai.model.Notification;
import com.devtrack.ai.model.User;
import com.devtrack.ai.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<?> getNotifications(
            @AuthenticationPrincipal User user, 
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<Notification> list = notificationService.getNotifications(user.getId(), unreadOnly);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/read/{id}")
    public ResponseEntity<?> markAsRead(@AuthenticationPrincipal User user, @PathVariable Long id) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            Notification read = notificationService.markAsRead(id);
            return ResponseEntity.ok(read);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
