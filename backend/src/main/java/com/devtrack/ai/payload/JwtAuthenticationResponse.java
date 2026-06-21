package com.devtrack.ai.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtAuthenticationResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private String email;
    private String name;
    private String role;
    private String githubUsername;

    public JwtAuthenticationResponse(String accessToken, String email, String name, String role, String githubUsername) {
        this.accessToken = accessToken;
        this.email = email;
        this.name = name;
        this.role = role;
        this.githubUsername = githubUsername;
    }
}
