package com.inzynierka.esports.repository;

import com.inzynierka.esports.domain.Matches;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Matches entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MatchesRepository extends JpaRepository<Matches, Long> {
}
