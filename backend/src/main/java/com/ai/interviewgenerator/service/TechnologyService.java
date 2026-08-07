package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.TechnologyDTO;

import java.util.List;

public interface TechnologyService {
    List<TechnologyDTO> getAllTechnologies();
    TechnologyDTO getTechnologyById(Long id);
    TechnologyDTO createTechnology(TechnologyDTO dto);
    TechnologyDTO updateTechnology(Long id, TechnologyDTO dto);
    void deleteTechnology(Long id);
}
