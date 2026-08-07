package com.ai.interviewgenerator.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "difficulties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Difficulty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "difficulty_name", nullable = false, unique = true, length = 50)
    private String difficultyName; // Easy, Medium, Hard
}
