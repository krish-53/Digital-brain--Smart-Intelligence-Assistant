package com.digitalbrain.models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "idea_connections")
public class IdeaConnection {

    @Id
    private String id = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_idea_id")
    private Idea sourceIdea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_idea_id")
    private Idea targetIdea;

    @Column(name = "relation_type")
    private String relationType;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Idea getSourceIdea() { return sourceIdea; }
    public void setSourceIdea(Idea sourceIdea) { this.sourceIdea = sourceIdea; }

    public Idea getTargetIdea() { return targetIdea; }
    public void setTargetIdea(Idea targetIdea) { this.targetIdea = targetIdea; }

    public String getRelationType() { return relationType; }
    public void setRelationType(String relationType) { this.relationType = relationType; }
}
