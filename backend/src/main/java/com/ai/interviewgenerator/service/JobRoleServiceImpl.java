package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.JobRoleDTO;
import com.ai.interviewgenerator.entity.JobRole;
import com.ai.interviewgenerator.exception.BadRequestException;
import com.ai.interviewgenerator.exception.ResourceNotFoundException;
import com.ai.interviewgenerator.repository.JobRoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobRoleServiceImpl implements JobRoleService {

    private final JobRoleRepository jobRoleRepository;

    @Override
    public List<JobRoleDTO> getAllJobRoles() {
        return jobRoleRepository.findAll().stream().map(this::mapToDTO).toList();
    }

    @Override
    public JobRoleDTO getJobRoleById(Long id) {
        JobRole role = jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + id));
        return mapToDTO(role);
    }

    @Override
    public JobRoleDTO createJobRole(JobRoleDTO dto) {
        if (jobRoleRepository.existsByRoleNameIgnoreCase(dto.getRoleName())) {
            throw new BadRequestException("Job role already exists with name: " + dto.getRoleName());
        }
        JobRole role = JobRole.builder()
                .roleName(dto.getRoleName())
                .description(dto.getDescription())
                .build();
        return mapToDTO(jobRoleRepository.save(role));
    }

    @Override
    public JobRoleDTO updateJobRole(Long id, JobRoleDTO dto) {
        JobRole role = jobRoleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job role not found with id: " + id));
        role.setRoleName(dto.getRoleName());
        role.setDescription(dto.getDescription());
        return mapToDTO(jobRoleRepository.save(role));
    }

    @Override
    public void deleteJobRole(Long id) {
        if (!jobRoleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job role not found with id: " + id);
        }
        jobRoleRepository.deleteById(id);
    }

    private JobRoleDTO mapToDTO(JobRole role) {
        return JobRoleDTO.builder()
                .id(role.getId())
                .roleName(role.getRoleName())
                .description(role.getDescription())
                .build();
    }
}
