package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.domain.Organizers;
import com.inzynierka.esports.repository.OrganizersRepository;
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
 * REST controller for managing {@link com.inzynierka.esports.domain.Organizers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OrganizersResource {

    private final Logger log = LoggerFactory.getLogger(OrganizersResource.class);

    private static final String ENTITY_NAME = "organizers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OrganizersRepository organizersRepository;

    public OrganizersResource(OrganizersRepository organizersRepository) {
        this.organizersRepository = organizersRepository;
    }

    /**
     * {@code POST  /organizers} : Create a new organizers.
     *
     * @param organizers the organizers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new organizers, or with status {@code 400 (Bad Request)} if the organizers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/organizers")
    public ResponseEntity<Organizers> createOrganizers(@RequestBody Organizers organizers) throws URISyntaxException {
        log.debug("REST request to save Organizers : {}", organizers);
        if (organizers.getId() != null) {
            throw new BadRequestAlertException("A new organizers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Organizers result = organizersRepository.save(organizers);
        return ResponseEntity.created(new URI("/api/organizers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /organizers} : Updates an existing organizers.
     *
     * @param organizers the organizers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated organizers,
     * or with status {@code 400 (Bad Request)} if the organizers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the organizers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/organizers")
    public ResponseEntity<Organizers> updateOrganizers(@RequestBody Organizers organizers) throws URISyntaxException {
        log.debug("REST request to update Organizers : {}", organizers);
        if (organizers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Organizers result = organizersRepository.save(organizers);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, organizers.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /organizers} : get all the organizers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of organizers in body.
     */
    @GetMapping("/organizers")
    public ResponseEntity<List<Organizers>> getAllOrganizers(Pageable pageable) {
        log.debug("REST request to get a page of Organizers");
        Page<Organizers> page = organizersRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /organizers/:id} : get the "id" organizers.
     *
     * @param id the id of the organizers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the organizers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/organizers/{id}")
    public ResponseEntity<Organizers> getOrganizers(@PathVariable Long id) {
        log.debug("REST request to get Organizers : {}", id);
        Optional<Organizers> organizers = organizersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(organizers);
    }

    /**
     * {@code DELETE  /organizers/:id} : delete the "id" organizers.
     *
     * @param id the id of the organizers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/organizers/{id}")
    public ResponseEntity<Void> deleteOrganizers(@PathVariable Long id) {
        log.debug("REST request to delete Organizers : {}", id);
        organizersRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
