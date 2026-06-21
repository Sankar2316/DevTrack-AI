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
public class ResumeAnalysisResponse {
    private int atsScore;
    private List<String> missingKeywords;
    private List<String> strengthAnalysis;
    private List<String> improvementSuggestions;
    private int jdMatchPercentage;
}
