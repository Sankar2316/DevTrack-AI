package com.devtrack.ai.service;

import com.devtrack.ai.model.*;
import com.devtrack.ai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoadmapRepository roadmapRepository;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private PlacementApplicationRepository placementApplicationRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(Long userId, String roleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            Role role = Role.valueOf(roleStr.toUpperCase());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleStr);
        }
        
        return userRepository.save(user);
    }

    public Map<String, Object> getPlatformAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long activeRoadmaps = roadmapRepository.count();
        long totalApplications = placementApplicationRepository.count();
        
        List<ResumeAnalysis> analyses = resumeAnalysisRepository.findAll();
        double avgAtsScore = analyses.stream()
                .mapToInt(ResumeAnalysis::getAtsScore)
                .average()
                .orElse(0.0);

        analytics.put("totalUsers", totalUsers);
        analytics.put("activeRoadmaps", activeRoadmaps);
        analytics.put("totalApplications", totalApplications);
        analytics.put("averageAtsScore", Math.round(avgAtsScore * 10.0) / 10.0);
        
        return analytics;
    }

    public Announcement createAnnouncement(String title, String content, String adminName) {
        Announcement announcement = Announcement.builder()
                .title(title)
                .content(content)
                .createdBy(adminName)
                .build();
        return announcementRepository.save(announcement);
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllByOrderByCreatedDateDesc();
    }

    public void deleteAnnouncement(Long announcementId) {
        announcementRepository.deleteById(announcementId);
    }
}
