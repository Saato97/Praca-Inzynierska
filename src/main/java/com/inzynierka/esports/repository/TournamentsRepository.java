package com.inzynierka.esports.repository;

import com.inzynierka.esports.domain.Tournaments;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Tournaments entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TournamentsRepository extends JpaRepository<Tournaments, Long> {
}
