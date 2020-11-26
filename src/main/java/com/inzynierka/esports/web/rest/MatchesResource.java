package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.domain.Matches;
import com.inzynierka.esports.repository.MatchesRepository;
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

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.inzynierka.esports.domain.Matches}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MatchesResource {

    private final Logger log = LoggerFactory.getLogger(MatchesResource.class);

    private static final String ENTITY_NAME = "matches";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MatchesRepository matchesRepository;

    public MatchesResource(MatchesRepository matchesRepository) {
        this.matchesRepository = matchesRepository;
    }

    /**
     * {@code POST  /matches} : Create a new matches.
     *
     * @param matches the matches to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new matches, or with status {@code 400 (Bad Request)} if the matches has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/matches")
    public ResponseEntity<Matches> createMatches(@RequestBody Matches matches) throws URISyntaxException {
        log.debug("REST request to save Matches : {}", matches);
        if (matches.getId() != null) {
            throw new BadRequestAlertException("A new matches cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Matches result = matchesRepository.save(matches);
        return ResponseEntity.created(new URI("/api/matches/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /matches} : Updates an existing matches.
     *
     * @param matches the matches to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated matches,
     * or with status {@code 400 (Bad Request)} if the matches is not valid,
     * or with status {@code 500 (Internal Server Error)} if the matches couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/matches")
    public ResponseEntity<Matches> updateMatches(@RequestBody Matches matches) throws URISyntaxException {
        log.debug("REST request to update Matches : {}", matches);
        if (matches.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Matches result = matchesRepository.save(matches);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, matches.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /matches} : get all the matches.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matches in body.
     */
    @GetMapping("/matches")
    public ResponseEntity<List<Matches>> getAllMatches(Pageable pageable) {
        log.debug("REST request to get a page of Matches");
        Page<Matches> page = matchesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /matches/:id} : get the "id" matches.
     *
     * @param id the id of the matches to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the matches, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/matches/{id}")
    public ResponseEntity<Matches> getMatches(@PathVariable Long id) {
        log.debug("REST request to get Matches : {}", id);
        Optional<Matches> matches = matchesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(matches);
    }

    /**
     * {@code DELETE  /matches/:id} : delete the "id" matches.
     *
     * @param id the id of the matches to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/matches/{id}")
    public ResponseEntity<Void> deleteMatches(@PathVariable Long id) {
        log.debug("REST request to delete Matches : {}", id);
        matchesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
