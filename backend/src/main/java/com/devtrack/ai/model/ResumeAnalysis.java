package com.devtrack.ai.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "ats_score")
    private int atsScore;

    @Column(columnDefinition = "TEXT")
    private String suggestions;

    @Column(name = "missing_keywords", length = 500)
    private String missingKeywords;

    @Column(name = "strength_analysis", columnDefinition = "TEXT")
    private String strengthAnalysis;

    @Column(name = "jd_match_percentage")
    private int jdMatchPercentage;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
    }
}
