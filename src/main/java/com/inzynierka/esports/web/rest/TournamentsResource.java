package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.domain.Tournaments;
import com.inzynierka.esports.repository.TournamentsRepository;
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
 * REST controller for managing {@link com.inzynierka.esports.domain.Tournaments}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class TournamentsResource {

    private final Logger log = LoggerFactory.getLogger(TournamentsResource.class);

    private static final String ENTITY_NAME = "tournaments";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TournamentsRepository tournamentsRepository;

    public TournamentsResource(TournamentsRepository tournamentsRepository) {
        this.tournamentsRepository = tournamentsRepository;
    }

    /**
     * {@code POST  /tournaments} : Create a new tournaments.
     *
     * @param tournaments the tournaments to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new tournaments, or with status {@code 400 (Bad Request)} if the tournaments has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/tournaments")
    public ResponseEntity<Tournaments> createTournaments(@Valid @RequestBody Tournaments tournaments) throws URISyntaxException {
        log.debug("REST request to save Tournaments : {}", tournaments);
        if (tournaments.getId() != null) {
            throw new BadRequestAlertException("A new tournaments cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Tournaments result = tournamentsRepository.save(tournaments);
        return ResponseEntity.created(new URI("/api/tournaments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /tournaments} : Updates an existing tournaments.
     *
     * @param tournaments the tournaments to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated tournaments,
     * or with status {@code 400 (Bad Request)} if the tournaments is not valid,
     * or with status {@code 500 (Internal Server Error)} if the tournaments couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/tournaments")
    public ResponseEntity<Tournaments> updateTournaments(@Valid @RequestBody Tournaments tournaments) throws URISyntaxException {
        log.debug("REST request to update Tournaments : {}", tournaments);
        if (tournaments.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Tournaments result = tournamentsRepository.save(tournaments);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, tournaments.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /tournaments} : get all the tournaments.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of tournaments in body.
     */
    @GetMapping("/tournaments")
    public ResponseEntity<List<Tournaments>> getAllTournaments(Pageable pageable) {
        log.debug("REST request to get a page of Tournaments");
        Page<Tournaments> page = tournamentsRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /tournaments/:id} : get the "id" tournaments.
     *
     * @param id the id of the tournaments to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the tournaments, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/tournaments/{id}")
    public ResponseEntity<Tournaments> getTournaments(@PathVariable Long id) {
        log.debug("REST request to get Tournaments : {}", id);
        Optional<Tournaments> tournaments = tournamentsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(tournaments);
    }

    /**
     * {@code DELETE  /tournaments/:id} : delete the "id" tournaments.
     *
     * @param id the id of the tournaments to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/tournaments/{id}")
    public ResponseEntity<Void> deleteTournaments(@PathVariable Long id) {
        log.debug("REST request to delete Tournaments : {}", id);
        tournamentsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
