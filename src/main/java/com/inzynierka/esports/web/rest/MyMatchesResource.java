package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.domain.ApplicationUsers;
import com.inzynierka.esports.domain.Matches;
import com.inzynierka.esports.domain.Teams;
import com.inzynierka.esports.repository.ApplicationUsersRepository;
import com.inzynierka.esports.service.UserService;

import io.github.jhipster.web.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
/**
 * MyMatchesResource controller
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MyMatchesResource {

    private final Logger log = LoggerFactory.getLogger(MyMatchesResource.class);

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ApplicationUsersRepository applicationUsersRepository;

    private final UserService userService;

    public MyMatchesResource(ApplicationUsersRepository applicationUsersRepository, UserService userService) {
        this.applicationUsersRepository = applicationUsersRepository;
        this.userService = userService;
    }

    /**
     * {@code GET  /my-matches} : get users matches.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of users matches in body.
     */
    @GetMapping("/user-profile")
    public ResponseEntity<List<Matches>> getMyMatches(Pageable pageable) {
        log.debug("REST request to get a page of Users Matches");

        Optional<ApplicationUsers> applicationUser = applicationUsersRepository.findById(userService.getUserWithAuthorities().get().getId());
        Set<Teams> appUserTeams = applicationUser.get().getTeams();
        Teams[] teamArray = appUserTeams.stream().toArray(n -> new Teams[n]);
        List <Matches> myMatches = new ArrayList<Matches>();
        for (Teams team : teamArray) {
            if (team.getMatches() != null) myMatches.add(team.getMatches());
        }
        myMatches.sort(Comparator.comparing(Matches::getStartDate));
        Page<Matches> page = new PageImpl<>(myMatches);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(myMatches);
    }

}
