package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.TechnologyDTO;
import com.ai.interviewgenerator.entity.Technology;
import com.ai.interviewgenerator.exception.BadRequestException;
import com.ai.interviewgenerator.exception.ResourceNotFoundException;
import com.ai.interviewgenerator.repository.TechnologyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TechnologyServiceImpl implements TechnologyService {

    private final TechnologyRepository technologyRepository;

    @Override
    public List<TechnologyDTO> getAllTechnologies() {
        return technologyRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Override
    public TechnologyDTO getTechnologyById(Long id) {
        Technology tech = technologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found with id: " + id));
        return mapToDTO(tech);
    }

    @Override
    public TechnologyDTO createTechnology(TechnologyDTO dto) {
        if (technologyRepository.existsByTechnologyNameIgnoreCase(dto.getTechnologyName())) {
            throw new BadRequestException("Technology already exists with name: " + dto.getTechnologyName());
        }
        Technology tech = Technology.builder()
                .technologyName(dto.getTechnologyName())
                .description(dto.getDescription())
                .build();
        return mapToDTO(technologyRepository.save(tech));
    }

    @Override
    public TechnologyDTO updateTechnology(Long id, TechnologyDTO dto) {
        Technology tech = technologyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Technology not found with id: " + id));
        tech.setTechnologyName(dto.getTechnologyName());
        tech.setDescription(dto.getDescription());
        return mapToDTO(technologyRepository.save(tech));
    }

    @Override
    public void deleteTechnology(Long id) {
        if (!technologyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Technology not found with id: " + id);
        }
        technologyRepository.deleteById(id);
    }

    private TechnologyDTO mapToDTO(Technology tech) {
        return TechnologyDTO.builder()
                .id(tech.getId())
                .technologyName(tech.getTechnologyName())
                .description(tech.getDescription())
                .build();
    }
}
