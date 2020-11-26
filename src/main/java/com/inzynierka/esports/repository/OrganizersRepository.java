package com.inzynierka.esports.repository;

import com.inzynierka.esports.domain.Organizers;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Organizers entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OrganizersRepository extends JpaRepository<Organizers, Long> {
}
