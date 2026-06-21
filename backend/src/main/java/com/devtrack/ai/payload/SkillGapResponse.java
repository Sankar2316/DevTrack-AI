package com.devtrack.ai.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillGapResponse {
    private String targetRole;
    private int readinessScore;
    private List<String> currentSkills;
    private List<String> requiredSkills;
    private List<String> missingSkills;
    private List<String> learningRecommendations;
    private String roadmapJson;
}
