package com.digitalbrain.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Entity
@Table(name = "file_records")
public class FileRecord {

    @Id
    private String id = UUID.randomUUID().toString();

    @Column(name = "user_id")
    private String userId;

    @Column(name = "filename")
    private String filename;

    @Column(name = "filepath", unique = true)
    private String filepath;

    @Column(name = "category")
    private String category;

    @Column(name = "summary", columnDefinition = "TEXT")
    private String summary;

    @Column(name = "scanned_at")
    private LocalDateTime scannedAt = LocalDateTime.now(ZoneOffset.UTC);

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getFilepath() { return filepath; }
    public void setFilepath(String filepath) { this.filepath = filepath; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public LocalDateTime getScannedAt() { return scannedAt; }
    public void setScannedAt(LocalDateTime scannedAt) { this.scannedAt = scannedAt; }
}
