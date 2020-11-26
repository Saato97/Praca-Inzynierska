package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.EsportsApp;
import com.inzynierka.esports.domain.Matches;
import com.inzynierka.esports.repository.MatchesRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link MatchesResource} REST controller.
 */
@SpringBootTest(classes = EsportsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class MatchesResourceIT {

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Long DEFAULT_TEAM_A = 1L;
    private static final Long UPDATED_TEAM_A = 2L;

    private static final Long DEFAULT_TEAM_B = 1L;
    private static final Long UPDATED_TEAM_B = 2L;

    private static final Long DEFAULT_WINNER = 1L;
    private static final Long UPDATED_WINNER = 2L;

    private static final String DEFAULT_MATCH_URL = "AAAAAAAAAA";
    private static final String UPDATED_MATCH_URL = "BBBBBBBBBB";

    @Autowired
    private MatchesRepository matchesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMatchesMockMvc;

    private Matches matches;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matches createEntity(EntityManager em) {
        Matches matches = new Matches()
            .startDate(DEFAULT_START_DATE)
            .teamA(DEFAULT_TEAM_A)
            .teamB(DEFAULT_TEAM_B)
            .winner(DEFAULT_WINNER)
            .matchUrl(DEFAULT_MATCH_URL);
        return matches;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Matches createUpdatedEntity(EntityManager em) {
        Matches matches = new Matches()
            .startDate(UPDATED_START_DATE)
            .teamA(UPDATED_TEAM_A)
            .teamB(UPDATED_TEAM_B)
            .winner(UPDATED_WINNER)
            .matchUrl(UPDATED_MATCH_URL);
        return matches;
    }

    @BeforeEach
    public void initTest() {
        matches = createEntity(em);
    }

    @Test
    @Transactional
    public void createMatches() throws Exception {
        int databaseSizeBeforeCreate = matchesRepository.findAll().size();
        // Create the Matches
        restMatchesMockMvc.perform(post("/api/matches")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(matches)))
            .andExpect(status().isCreated());

        // Validate the Matches in the database
        List<Matches> matchesList = matchesRepository.findAll();
        assertThat(matchesList).hasSize(databaseSizeBeforeCreate + 1);
        Matches testMatches = matchesList.get(matchesList.size() - 1);
        assertThat(testMatches.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testMatches.getTeamA()).isEqualTo(DEFAULT_TEAM_A);
        assertThat(testMatches.getTeamB()).isEqualTo(DEFAULT_TEAM_B);
        assertThat(testMatches.getWinner()).isEqualTo(DEFAULT_WINNER);
        assertThat(testMatches.getMatchUrl()).isEqualTo(DEFAULT_MATCH_URL);
    }

    @Test
    @Transactional
    public void createMatchesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = matchesRepository.findAll().size();

        // Create the Matches with an existing ID
        matches.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMatchesMockMvc.perform(post("/api/matches")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(matches)))
            .andExpect(status().isBadRequest());

        // Validate the Matches in the database
        List<Matches> matchesList = matchesRepository.findAll();
        assertThat(matchesList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllMatches() throws Exception {
        // Initialize the database
        matchesRepository.saveAndFlush(matches);

        // Get all the matchesList
        restMatchesMockMvc.perform(get("/api/matches?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(matches.getId().intValue())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].teamA").value(hasItem(DEFAULT_TEAM_A.intValue())))
            .andExpect(jsonPath("$.[*].teamB").value(hasItem(DEFAULT_TEAM_B.intValue())))
            .andExpect(jsonPath("$.[*].winner").value(hasItem(DEFAULT_WINNER.intValue())))
            .andExpect(jsonPath("$.[*].matchUrl").value(hasItem(DEFAULT_MATCH_URL)));
    }
    
    @Test
    @Transactional
    public void getMatches() throws Exception {
        // Initialize the database
        matchesRepository.saveAndFlush(matches);

        // Get the matches
        restMatchesMockMvc.perform(get("/api/matches/{id}", matches.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(matches.getId().intValue()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.teamA").value(DEFAULT_TEAM_A.intValue()))
            .andExpect(jsonPath("$.teamB").value(DEFAULT_TEAM_B.intValue()))
            .andExpect(jsonPath("$.winner").value(DEFAULT_WINNER.intValue()))
            .andExpect(jsonPath("$.matchUrl").value(DEFAULT_MATCH_URL));
    }
    @Test
    @Transactional
    public void getNonExistingMatches() throws Exception {
        // Get the matches
        restMatchesMockMvc.perform(get("/api/matches/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMatches() throws Exception {
        // Initialize the database
        matchesRepository.saveAndFlush(matches);

        int databaseSizeBeforeUpdate = matchesRepository.findAll().size();

        // Update the matches
        Matches updatedMatches = matchesRepository.findById(matches.getId()).get();
        // Disconnect from session so that the updates on updatedMatches are not directly saved in db
        em.detach(updatedMatches);
        updatedMatches
            .startDate(UPDATED_START_DATE)
            .teamA(UPDATED_TEAM_A)
            .teamB(UPDATED_TEAM_B)
            .winner(UPDATED_WINNER)
            .matchUrl(UPDATED_MATCH_URL);

        restMatchesMockMvc.perform(put("/api/matches")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedMatches)))
            .andExpect(status().isOk());

        // Validate the Matches in the database
        List<Matches> matchesList = matchesRepository.findAll();
        assertThat(matchesList).hasSize(databaseSizeBeforeUpdate);
        Matches testMatches = matchesList.get(matchesList.size() - 1);
        assertThat(testMatches.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testMatches.getTeamA()).isEqualTo(UPDATED_TEAM_A);
        assertThat(testMatches.getTeamB()).isEqualTo(UPDATED_TEAM_B);
        assertThat(testMatches.getWinner()).isEqualTo(UPDATED_WINNER);
        assertThat(testMatches.getMatchUrl()).isEqualTo(UPDATED_MATCH_URL);
    }

    @Test
    @Transactional
    public void updateNonExistingMatches() throws Exception {
        int databaseSizeBeforeUpdate = matchesRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMatchesMockMvc.perform(put("/api/matches")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(matches)))
            .andExpect(status().isBadRequest());

        // Validate the Matches in the database
        List<Matches> matchesList = matchesRepository.findAll();
        assertThat(matchesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMatches() throws Exception {
        // Initialize the database
        matchesRepository.saveAndFlush(matches);

        int databaseSizeBeforeDelete = matchesRepository.findAll().size();

        // Delete the matches
        restMatchesMockMvc.perform(delete("/api/matches/{id}", matches.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Matches> matchesList = matchesRepository.findAll();
        assertThat(matchesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
