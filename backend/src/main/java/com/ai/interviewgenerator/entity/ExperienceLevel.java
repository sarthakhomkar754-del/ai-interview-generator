package com.ai.interviewgenerator.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "experience_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperienceLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "level_name", nullable = false, unique = true, length = 50)
    private String levelName; // Fresher, Intermediate, Experienced
}
