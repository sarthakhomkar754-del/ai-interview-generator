package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.DifficultyDTO;
import com.ai.interviewgenerator.repository.DifficultyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DifficultyServiceImpl implements DifficultyService {

    private final DifficultyRepository difficultyRepository;

    @Override
    public List<DifficultyDTO> getAllDifficulties() {
        return difficultyRepository.findAll().stream().map(d ->
                DifficultyDTO.builder().id(d.getId()).difficultyName(d.getDifficultyName()).build()
        ).toList();
    }
}
