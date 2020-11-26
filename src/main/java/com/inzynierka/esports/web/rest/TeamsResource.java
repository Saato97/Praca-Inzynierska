package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.domain.Teams;
import com.inzynierka.esports.repository.TeamsRepository;
import com.inzynierka.esports.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.inzynierka.esports.domain.Teams}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TeamsResource {

    private final Logger log = LoggerFactory.getLogger(TeamsResource.class);

    private static final String ENTITY_NAME = "teams";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeamsRepository teamsRepository;

    public TeamsResource(TeamsRepository teamsRepository) {
        this.teamsRepository = teamsRepository;
    }

    /**
     * {@code POST  /teams} : Create a new teams.
     *
     * @param teams the teams to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teams, or with status {@code 400 (Bad Request)} if the teams has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/teams")
    public ResponseEntity<Teams> createTeams(@Valid @RequestBody Teams teams) throws URISyntaxException {
        log.debug("REST request to save Teams : {}", teams);
        if (teams.getId() != null) {
            throw new BadRequestAlertException("A new teams cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Teams result = teamsRepository.save(teams);
        return ResponseEntity.created(new URI("/api/teams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /teams} : Updates an existing teams.
     *
     * @param teams the teams to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teams,
     * or with status {@code 400 (Bad Request)} if the teams is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teams couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/teams")
    public ResponseEntity<Teams> updateTeams(@Valid @RequestBody Teams teams) throws URISyntaxException {
        log.debug("REST request to update Teams : {}", teams);
        if (teams.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Teams result = teamsRepository.save(teams);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teams.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /teams} : get all the teams.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teams in body.
     */
    @GetMapping("/teams")
    public ResponseEntity<List<Teams>> getAllTeams(Pageable pageable, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of Teams");
        Page<Teams> page;
        if (eagerload) {
            page = teamsRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = teamsRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /teams/:id} : get the "id" teams.
     *
     * @param id the id of the teams to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teams, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/teams/{id}")
    public ResponseEntity<Teams> getTeams(@PathVariable Long id) {
        log.debug("REST request to get Teams : {}", id);
        Optional<Teams> teams = teamsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(teams);
    }

    /**
     * {@code DELETE  /teams/:id} : delete the "id" teams.
     *
     * @param id the id of the teams to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/teams/{id}")
    public ResponseEntity<Void> deleteTeams(@PathVariable Long id) {
        log.debug("REST request to delete Teams : {}", id);
        teamsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
