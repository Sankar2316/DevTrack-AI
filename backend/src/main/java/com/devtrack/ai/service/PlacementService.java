package com.devtrack.ai.service;

import com.devtrack.ai.model.PlacementApplication;
import com.devtrack.ai.model.PlacementStatus;
import com.devtrack.ai.model.User;
import com.devtrack.ai.repository.PlacementApplicationRepository;
import com.devtrack.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PlacementService {

    @Autowired
    private PlacementApplicationRepository placementApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<PlacementApplication> getApplications(Long userId) {
        return placementApplicationRepository.findByUserId(userId);
    }

    public PlacementApplication addApplication(Long userId, String companyName, String status, LocalDate appliedDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        PlacementStatus placementStatus = PlacementStatus.APPLIED;
        try {
            placementStatus = PlacementStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            // keep APPLIED
        }

        PlacementApplication application = PlacementApplication.builder()
                .user(user)
                .companyName(companyName)
                .status(placementStatus)
                .appliedDate(appliedDate != null ? appliedDate : LocalDate.now())
                .build();

        return placementApplicationRepository.save(application);
    }

    public PlacementApplication updateStatus(Long applicationId, String status) {
        PlacementApplication application = placementApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        try {
            PlacementStatus placementStatus = PlacementStatus.valueOf(status.toUpperCase());
            application.setStatus(placementStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status type: " + status);
        }

        return placementApplicationRepository.save(application);
    }

    public void deleteApplication(Long applicationId) {
        placementApplicationRepository.deleteById(applicationId);
    }
}
