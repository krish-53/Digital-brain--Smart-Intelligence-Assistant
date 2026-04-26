package com.digitalbrain.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Entity
@Table(name = "habits")
public class Habit {

    @Id
    private String id = UUID.randomUUID().toString();

    @Column(name = "user_id")
    private String userId;

    @Column(name = "pattern_name")
    private String patternName;

    @Column(name = "frequency")
    private Integer frequency = 1;

    @Column(name = "last_detected_at")
    private LocalDateTime lastDetectedAt = LocalDateTime.now(ZoneOffset.UTC);

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getPatternName() { return patternName; }
    public void setPatternName(String patternName) { this.patternName = patternName; }

    public Integer getFrequency() { return frequency; }
    public void setFrequency(Integer frequency) { this.frequency = frequency; }

    public LocalDateTime getLastDetectedAt() { return lastDetectedAt; }
    public void setLastDetectedAt(LocalDateTime lastDetectedAt) { this.lastDetectedAt = lastDetectedAt; }
}
