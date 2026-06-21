package com.devtrack.ai.repository;

import com.devtrack.ai.model.GitHubStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GitHubStatsRepository extends JpaRepository<GitHubStats, Long> {
    Optional<GitHubStats> findByUserId(Long userId);
}
