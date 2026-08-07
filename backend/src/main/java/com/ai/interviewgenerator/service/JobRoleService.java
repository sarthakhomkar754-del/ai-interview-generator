package com.ai.interviewgenerator.service;

import com.ai.interviewgenerator.dto.JobRoleDTO;

import java.util.List;

public interface JobRoleService {
    List<JobRoleDTO> getAllJobRoles();
    JobRoleDTO getJobRoleById(Long id);
    JobRoleDTO createJobRole(JobRoleDTO dto);
    JobRoleDTO updateJobRole(Long id, JobRoleDTO dto);
    void deleteJobRole(Long id);
}
