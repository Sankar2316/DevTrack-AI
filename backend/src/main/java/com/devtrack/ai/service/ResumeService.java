package com.devtrack.ai.service;

import com.devtrack.ai.model.ResumeAnalysis;
import com.devtrack.ai.model.User;
import com.devtrack.ai.repository.ResumeAnalysisRepository;
import com.devtrack.ai.repository.UserRepository;
import com.devtrack.ai.payload.ResumeAnalysisResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ResumeService {

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ResumeAnalysis> getAnalysisHistory(Long userId) {
        return resumeAnalysisRepository.findByUserIdOrderByCreatedDateDesc(userId);
    }

    public ResumeAnalysis analyzeResume(Long userId, String fileName, byte[] content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Extract text from bytes in a simplified way (ASCII scanning)
        String fileContentText = new String(content).toLowerCase();
        
        // Scan for matching keywords in file
        List<String> targetKeywords = Arrays.asList(
                "java", "spring boot", "react", "mysql", "docker", "kubernetes", 
                "aws", "microservices", "javascript", "typescript", "git", "ci/cd", 
                "redis", "data structures", "algorithms", "rest api"
        );

        List<String> foundKeywords = new ArrayList<>();
        List<String> missingKeywords = new ArrayList<>();

        for (String keyword : targetKeywords) {
            if (fileContentText.contains(keyword) || fileName.toLowerCase().contains(keyword)) {
                foundKeywords.add(keyword);
            } else {
                missingKeywords.add(keyword);
            }
        }

        // Calculate score
        int baseScore = 60;
        int scoreIncrement = targetKeywords.size() > 0 ? (35 * foundKeywords.size()) / targetKeywords.size() : 0;
        int atsScore = Math.min(98, baseScore + scoreIncrement);
        int jdMatchPercentage = Math.min(100, atsScore + new Random().nextInt(5));

        // Generate suggestions
        List<String> suggestions = new ArrayList<>();
        if (missingKeywords.contains("kubernetes") || missingKeywords.contains("docker")) {
            suggestions.add("Incorporate containerization tech like Docker & Kubernetes in project listings.");
        }
        if (missingKeywords.contains("ci/cd") || missingKeywords.contains("git")) {
            suggestions.add("Highlight workflows automation, DevOps, CI/CD, and Git repository controls.");
        }
        if (missingKeywords.contains("microservices") || missingKeywords.contains("rest api")) {
            suggestions.add("Clarify backend structures: define microservices architectures and API endpoints.");
        }
        if (atsScore < 75) {
            suggestions.add("Provide quantitative achievements (e.g. 'Improved efficiency by 20%' or 'Reduced latency by 150ms').");
        }
        suggestions.add("Ensure your resume uses a clean single-column format for optimal ATS parsing.");

        // Strength analysis
        List<String> strengths = new ArrayList<>();
        if (foundKeywords.contains("java") || foundKeywords.contains("react")) {
            strengths.add("Excellent core stack representation (Java/React).");
        }
        if (foundKeywords.contains("algorithms") || foundKeywords.contains("data structures")) {
            strengths.add("Strong emphasis on computer science fundamentals.");
        }
        if (atsScore > 80) {
            strengths.add("Good keyword coverage matching industry software engineer roles.");
        } else {
            strengths.add("Clear structure outlining developer roles and projects.");
        }

        String suggestionsText = String.join(" | ", suggestions);
        String missingKeywordsText = missingKeywords.stream().limit(5).collect(Collectors.joining(", "));
        String strengthText = String.join(" | ", strengths);

        ResumeAnalysis analysis = ResumeAnalysis.builder()
                .user(user)
                .atsScore(atsScore)
                .suggestions(suggestionsText)
                .missingKeywords(missingKeywordsText)
                .strengthAnalysis(strengthText)
                .jdMatchPercentage(jdMatchPercentage)
                .build();

        return resumeAnalysisRepository.save(analysis);
    }
}
