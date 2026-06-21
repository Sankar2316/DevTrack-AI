package com.devtrack.ai.repository;

import com.devtrack.ai.model.CodingProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodingProgressRepository extends JpaRepository<CodingProgress, Long> {
    Optional<CodingProgress> findByUserId(Long userId);
}
