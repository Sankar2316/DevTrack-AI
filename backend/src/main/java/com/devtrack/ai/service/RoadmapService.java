package com.devtrack.ai.service;

import com.devtrack.ai.model.Roadmap;
import com.devtrack.ai.model.User;
import com.devtrack.ai.repository.RoadmapRepository;
import com.devtrack.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoadmapService {

    @Autowired
    private RoadmapRepository roadmapRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<Roadmap> getActiveRoadmap(Long userId) {
        return roadmapRepository.findByUserId(userId);
    }

    public String generateOrUpdateRoadmap(Long userId, String targetRole, List<String> missingSkills) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate JSON timeline structure
        StringBuilder jsonBuilder = new StringBuilder();
        jsonBuilder.append("[");
        
        int week = 1;
        
        // Always add foundational milestone
        jsonBuilder.append(String.format(
            "{\"week\":%d,\"title\":\"Core Fundamentals & Goal Definition\",\"completed\":true,\"topics\":[\"Review active pre-requisites\",\"Set up local dev environment\"]}", 
            week++
        ));

        for (String skill : missingSkills) {
            jsonBuilder.append(",");
            jsonBuilder.append(String.format(
                "{\"week\":%d,\"title\":\"Deep Dive into %s\",\"completed\":false,\"topics\":[\"Study core guides on %s\",\"Build minor portfolio projects for %s\",\"Review common interview questions\"]}", 
                week, skill, skill, skill, skill
            ));
            week++;
        }

        // Add capstone deployment milestone
        jsonBuilder.append(",");
        jsonBuilder.append(String.format(
            "{\"week\":%d,\"title\":\"Full Capstone Project & Deployment\",\"completed\":false,\"topics\":[\"Integrate all technologies learned\",\"Deploy application to cloud (e.g. Render/AWS)\",\"Optimize resume descriptions\"]}", 
            week
        ));

        jsonBuilder.append("]");
        String planJson = jsonBuilder.toString();

        // Check if there is an existing roadmap
        Optional<Roadmap> roadmapOpt = roadmapRepository.findByUserId(userId);
        Roadmap roadmap;
        if (roadmapOpt.isPresent()) {
            roadmap = roadmapOpt.get();
            roadmap.setTargetRole(targetRole);
            roadmap.setGeneratedPlan(planJson);
            roadmap.setCompletionPercentage(20); // Reset to base 20% due to first week completed
        } else {
            roadmap = Roadmap.builder()
                    .user(user)
                    .targetRole(targetRole)
                    .generatedPlan(planJson)
                    .completionPercentage(20)
                    .build();
        }

        roadmapRepository.save(roadmap);
        return planJson;
    }

    public Roadmap updateRoadmapProgress(Long userId, String planJson, int percentage) {
        Roadmap roadmap = roadmapRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No active roadmap found for user"));
        
        roadmap.setGeneratedPlan(planJson);
        roadmap.setCompletionPercentage(percentage);
        return roadmapRepository.save(roadmap);
    }
}
