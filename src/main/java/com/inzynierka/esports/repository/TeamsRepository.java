package com.inzynierka.esports.repository;

import com.inzynierka.esports.domain.Teams;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Teams entity.
 */
@Repository
public interface TeamsRepository extends JpaRepository<Teams, Long> {

    @Query(value = "select distinct teams from Teams teams left join fetch teams.applicationUsers",
        countQuery = "select count(distinct teams) from Teams teams")
    Page<Teams> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct teams from Teams teams join fetch teams.tournaments tournaments where tournaments.id = :id",
        countQuery = "select count(distinct teams) from Teams teams")
    Page<Teams> findTournamentTeamsWithEagerRelationships(Pageable pageable, @Param("id") Long id);

    @Query(value = "select teams from Teams teams join teams.tournaments tournaments where tournaments.id = :id")
    Page<Teams> findTournamentTeams(Pageable pageable, @Param("id") Long id);

    @Query("select distinct teams from Teams teams left join fetch teams.applicationUsers")
    List<Teams> findAllWithEagerRelationships();

    @Query("select teams from Teams teams left join fetch teams.applicationUsers where teams.id =:id")
    Optional<Teams> findOneWithEagerRelationships(@Param("id") Long id);
}
