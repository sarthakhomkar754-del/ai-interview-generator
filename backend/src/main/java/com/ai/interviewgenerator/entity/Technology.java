package com.ai.interviewgenerator.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "technologies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Technology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "technology_name", nullable = false, unique = true, length = 100)
    private String technologyName;

    @Column(columnDefinition = "TEXT")
    private String description;
}
