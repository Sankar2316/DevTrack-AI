package com.devtrack.ai.controller;

import com.devtrack.ai.model.Skill;
import com.devtrack.ai.model.User;
import com.devtrack.ai.payload.SkillGapRequest;
import com.devtrack.ai.payload.SkillGapResponse;
import com.devtrack.ai.service.SkillGapService;
import com.devtrack.ai.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
public class SkillGapController {

    @Autowired
    private SkillGapService skillGapService;

    @Autowired
    private SkillRepository skillRepository;

    @PostMapping("/gap-analysis")
    public ResponseEntity<?> analyzeSkillGap(
            @AuthenticationPrincipal User user, 
            @RequestBody SkillGapRequest request) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        try {
            SkillGapResponse response = skillGapService.analyzeGap(user.getId(), request.getTargetRole());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> listSkills(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<Skill> skills = skillRepository.findByUserId(user.getId());
        return ResponseEntity.ok(skills);
    }
}
