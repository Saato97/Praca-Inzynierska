package com.inzynierka.esports.repository;

import com.inzynierka.esports.domain.Game;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the Game entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GameRepository extends JpaRepository<Game, Long> {
}
