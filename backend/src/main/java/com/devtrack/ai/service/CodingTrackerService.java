package com.devtrack.ai.service;

import com.devtrack.ai.model.CodingProgress;
import com.devtrack.ai.model.User;
import com.devtrack.ai.repository.CodingProgressRepository;
import com.devtrack.ai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CodingTrackerService {

    @Autowired
    private CodingProgressRepository codingProgressRepository;

    @Autowired
    private UserRepository userRepository;

    public CodingProgress getProgress(Long userId) {
        return codingProgressRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    CodingProgress progress = CodingProgress.builder()
                            .user(user)
                            .leetcodeProblems(0)
                            .hackerrankProblems(0)
                            .dailyStreak(0)
                            .weeklyGoals(10)
                            .monthlyGoals(40)
                            .build();
                    return codingProgressRepository.save(progress);
                });
    }

    public CodingProgress updateProgress(Long userId, int leetcode, int hackerrank, int weeklyGoal, int monthlyGoal) {
        CodingProgress progress = getProgress(userId);
        
        // If problems solved increased, increment streak
        if (leetcode > progress.getLeetcodeProblems() || hackerrank > progress.getHackerrankProblems()) {
            progress.setDailyStreak(progress.getDailyStreak() + 1);
        }
        
        progress.setLeetcodeProblems(leetcode);
        progress.setHackerrankProblems(hackerrank);
        progress.setWeeklyGoals(weeklyGoal);
        progress.setMonthlyGoals(monthlyGoal);
        
        return codingProgressRepository.save(progress);
    }
}
