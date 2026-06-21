package com.devtrack.ai.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "github_stats")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitHubStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private int commits;
    private int streak;

    @Column(name = "longest_streak")
    private int longestStreak;
}
