package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.domain.ApplicationUsers;
import com.inzynierka.esports.domain.Teams;
import com.inzynierka.esports.repository.ApplicationUsersRepository;
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
import java.util.Set;

/**
 * REST controller for managing {@link com.inzynierka.esports.domain.ApplicationUsers}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ApplicationUsersResource {

    private final Logger log = LoggerFactory.getLogger(ApplicationUsersResource.class);

    private static final String ENTITY_NAME = "applicationUsers";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ApplicationUsersRepository applicationUsersRepository;

    public ApplicationUsersResource(ApplicationUsersRepository applicationUsersRepository) {
        this.applicationUsersRepository = applicationUsersRepository;
    }

    /**
     * {@code POST  /application-users} : Create a new applicationUsers.
     *
     * @param applicationUsers the applicationUsers to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new applicationUsers, or with status {@code 400 (Bad Request)} if the applicationUsers has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/application-users")
    public ResponseEntity<ApplicationUsers> createApplicationUsers(@Valid @RequestBody ApplicationUsers applicationUsers) throws URISyntaxException {
        log.debug("REST request to save ApplicationUsers : {}", applicationUsers);
        if (applicationUsers.getId() != null) {
            throw new BadRequestAlertException("A new applicationUsers cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ApplicationUsers result = applicationUsersRepository.save(applicationUsers);
        return ResponseEntity.created(new URI("/api/application-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /application-users} : Updates an existing applicationUsers.
     *
     * @param applicationUsers the applicationUsers to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated applicationUsers,
     * or with status {@code 400 (Bad Request)} if the applicationUsers is not valid,
     * or with status {@code 500 (Internal Server Error)} if the applicationUsers couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/application-users")
    public ResponseEntity<ApplicationUsers> updateApplicationUsers(@Valid @RequestBody ApplicationUsers applicationUsers) throws URISyntaxException {
        log.debug("REST request to update ApplicationUsers : {}", applicationUsers);
        if (applicationUsers.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ApplicationUsers result = applicationUsersRepository.save(applicationUsers);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, applicationUsers.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /application-users} : get all the applicationUsers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of applicationUsers in body.
     */
    @GetMapping("/application-users")
    public ResponseEntity<List<ApplicationUsers>> getAllApplicationUsers(Pageable pageable) {
        log.debug("REST request to get a page of ApplicationUsers");
        Page<ApplicationUsers> page = applicationUsersRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /application-users/:id} : get the "id" applicationUsers.
     *
     * @param id the id of the applicationUsers to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the applicationUsers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/application-users/{id}")
    public ResponseEntity<ApplicationUsers> getApplicationUsers(@PathVariable Long id) {
        log.debug("REST request to get ApplicationUsers : {}", id);
        Optional<ApplicationUsers> applicationUsers = applicationUsersRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(applicationUsers);
    }

        /**
     * {@code GET  /application-users/participant} : get the applicationUsers that is a participant.
     *
     * @param appUserId the id of the applicationUsers to retrieve.
     * @param tournamentId the id of the tournament ID to compare.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the applicationUsers, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/application-users/participant")
    public ResponseEntity<ApplicationUsers> getParticipant(@RequestParam Long appUserId, @RequestParam Long tournamentId) {
        log.debug("REST request to get Tournaments Participant : {}", appUserId);
        Optional<ApplicationUsers> applicationUsers = applicationUsersRepository.findById(appUserId);
        Set<Teams> teams = applicationUsers.get().getTeams();
        Boolean[] participant = {false};
        log.debug("TEAMS: "+teams);
        teams.stream().forEach(t -> {
            if (t.getTournaments().getId().equals(tournamentId)) {
                participant[0] = true;
            }
        });
        if (participant[0]) {
            return ResponseUtil.wrapOrNotFound(applicationUsers);
        }
        else {
            return ResponseEntity.ok().body(null);
        }
    }

    /**
     * {@code DELETE  /application-users/:id} : delete the "id" applicationUsers.
     *
     * @param id the id of the applicationUsers to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/application-users/{id}")
    public ResponseEntity<Void> deleteApplicationUsers(@PathVariable Long id) {
        log.debug("REST request to delete ApplicationUsers : {}", id);
        applicationUsersRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
