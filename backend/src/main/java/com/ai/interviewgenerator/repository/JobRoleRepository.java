package com.ai.interviewgenerator.repository;

import com.ai.interviewgenerator.entity.JobRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRoleRepository extends JpaRepository<JobRole, Long> {
    Optional<JobRole> findByRoleNameIgnoreCase(String roleName);
    Boolean existsByRoleNameIgnoreCase(String roleName);
}
