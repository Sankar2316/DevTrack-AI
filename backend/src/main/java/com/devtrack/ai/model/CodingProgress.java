package com.devtrack.ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "coding_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "leetcode_problems")
    private int leetcodeProblems;

    @Column(name = "hackerrank_problems")
    private int hackerrankProblems;

    @Column(name = "daily_streak")
    private int dailyStreak;

    @Column(name = "weekly_goals")
    private int weeklyGoals;

    @Column(name = "monthly_goals")
    private int monthlyGoals;
}
