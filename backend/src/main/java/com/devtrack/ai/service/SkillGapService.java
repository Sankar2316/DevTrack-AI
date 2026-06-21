package com.devtrack.ai.service;

import com.devtrack.ai.model.Skill;
import com.devtrack.ai.repository.SkillRepository;
import com.devtrack.ai.payload.SkillGapResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private RoadmapService roadmapService;

    // Role Requirements Templates
    private static final Map<String, List<String>> ROLE_REQUIREMENTS = new HashMap<>();

    static {
        ROLE_REQUIREMENTS.put("Java Developer", Arrays.asList("Java", "Spring Boot", "MySQL", "Git", "REST API", "Microservices"));
        ROLE_REQUIREMENTS.put("Full Stack Developer", Arrays.asList("Java", "React", "JavaScript", "HTML/CSS", "Spring Boot", "REST API"));
        ROLE_REQUIREMENTS.put("Data Analyst", Arrays.asList("Python", "SQL", "Pandas", "Excel", "Tableau", "Statistics"));
        ROLE_REQUIREMENTS.put("Cloud Engineer", Arrays.asList("AWS", "Docker", "Kubernetes", "Linux", "Terraform", "CI/CD"));
    }

    public SkillGapResponse analyzeGap(Long userId, String targetRole) {
        List<Skill> userSkills = skillRepository.findByUserId(userId);
        
        List<String> required = ROLE_REQUIREMENTS.getOrDefault(targetRole, ROLE_REQUIREMENTS.get("Java Developer"));
        
        Set<String> userSkillNamesLower = userSkills.stream()
                .filter(s -> s.getSkillLevel() >= 3) // Level 3+ counts as proficiency
                .map(s -> s.getSkillName().toLowerCase())
                .collect(Collectors.toSet());

        List<String> missing = new ArrayList<>();
        List<String> current = new ArrayList<>();

        for (String req : required) {
            if (userSkillNamesLower.contains(req.toLowerCase())) {
                current.add(req);
            } else {
                missing.add(req);
            }
        }

        // Calculate score
        int readinessScore = required.size() > 0 ? (100 * current.size()) / required.size() : 0;

        // Recommendations
        List<String> recommendations = new ArrayList<>();
        for (String mis : missing) {
            recommendations.add("Complete online certification or module in: " + mis);
        }
        if (readinessScore < 70) {
            recommendations.add("Focus on core foundational projects before applying for job opportunities.");
        } else {
            recommendations.add("Your profile matches this role's baseline. Apply for active jobs and refine interview readiness.");
        }

        // Generate roadmap in database
        String roadmapJson = roadmapService.generateOrUpdateRoadmap(userId, targetRole, missing);

        return SkillGapResponse.builder()
                .targetRole(targetRole)
                .readinessScore(readinessScore)
                .currentSkills(current)
                .requiredSkills(required)
                .missingSkills(missing)
                .learningRecommendations(recommendations)
                .roadmapJson(roadmapJson)
                .build();
    }
}
