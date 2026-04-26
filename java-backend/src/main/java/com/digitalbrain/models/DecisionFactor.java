package com.digitalbrain.models;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "decision_factors")
public class DecisionFactor {

    @Id
    private String id = UUID.randomUUID().toString();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "decision_id")
    private Decision decision;

    @Column(name = "name")
    private String name;

    @Column(name = "weight")
    private Double weight = 1.0;

    @Column(name = "is_pro")
    private Boolean isPro = true;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Decision getDecision() { return decision; }
    public void setDecision(Decision decision) { this.decision = decision; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }

    public Boolean getIsPro() { return isPro; }
    public void setIsPro(Boolean isPro) { this.isPro = isPro; }
}
