package com.devtrack.ai.controller;

import com.devtrack.ai.model.ResumeAnalysis;
import com.devtrack.ai.model.User;
import com.devtrack.ai.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<ResumeAnalysis> history = resumeService.getAnalysisHistory(user.getId());
        return ResponseEntity.ok(history);
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> uploadAndAnalyze(
            @AuthenticationPrincipal User user, 
            @RequestParam("file") MultipartFile file) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            byte[] fileBytes = file.getBytes();
            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf";
            ResumeAnalysis analysis = resumeService.analyzeResume(user.getId(), originalFilename, fileBytes);
            return ResponseEntity.ok(analysis);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Failed to read uploaded resume file: " + e.getMessage());
        }
    }
}
