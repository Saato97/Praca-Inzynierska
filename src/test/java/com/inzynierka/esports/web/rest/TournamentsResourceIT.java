package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.EsportsApp;
import com.inzynierka.esports.domain.Tournaments;
import com.inzynierka.esports.repository.TournamentsRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.inzynierka.esports.domain.enumeration.Games;
/**
 * Integration tests for the {@link TournamentsResource} REST controller.
 */
@SpringBootTest(classes = EsportsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class TournamentsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Games DEFAULT_GAME_TYPE = Games.LOL;
    private static final Games UPDATED_GAME_TYPE = Games.CSGO;

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_MAX_PARTICIPANTS = 1;
    private static final Integer UPDATED_MAX_PARTICIPANTS = 2;

    private static final Integer DEFAULT_CURRENT_PARTICIPANTS = 1;
    private static final Integer UPDATED_CURRENT_PARTICIPANTS = 2;

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final byte[] DEFAULT_TOURNAMENT_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_TOURNAMENT_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_TOURNAMENT_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_TOURNAMENT_LOGO_CONTENT_TYPE = "image/png";

    @Autowired
    private TournamentsRepository tournamentsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTournamentsMockMvc;

    private Tournaments tournaments;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tournaments createEntity(EntityManager em) {
        Tournaments tournaments = new Tournaments()
            .name(DEFAULT_NAME)
            .gameType(DEFAULT_GAME_TYPE)
            .description(DEFAULT_DESCRIPTION)
            .maxParticipants(DEFAULT_MAX_PARTICIPANTS)
            .currentParticipants(DEFAULT_CURRENT_PARTICIPANTS)
            .startDate(DEFAULT_START_DATE)
            .tournamentLogo(DEFAULT_TOURNAMENT_LOGO)
            .tournamentLogoContentType(DEFAULT_TOURNAMENT_LOGO_CONTENT_TYPE);
        return tournaments;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Tournaments createUpdatedEntity(EntityManager em) {
        Tournaments tournaments = new Tournaments()
            .name(UPDATED_NAME)
            .gameType(UPDATED_GAME_TYPE)
            .description(UPDATED_DESCRIPTION)
            .maxParticipants(UPDATED_MAX_PARTICIPANTS)
            .currentParticipants(UPDATED_CURRENT_PARTICIPANTS)
            .startDate(UPDATED_START_DATE)
            .tournamentLogo(UPDATED_TOURNAMENT_LOGO)
            .tournamentLogoContentType(UPDATED_TOURNAMENT_LOGO_CONTENT_TYPE);
        return tournaments;
    }

    @BeforeEach
    public void initTest() {
        tournaments = createEntity(em);
    }

    @Test
    @Transactional
    public void createTournaments() throws Exception {
        int databaseSizeBeforeCreate = tournamentsRepository.findAll().size();
        // Create the Tournaments
        restTournamentsMockMvc.perform(post("/api/tournaments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tournaments)))
            .andExpect(status().isCreated());

        // Validate the Tournaments in the database
        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeCreate + 1);
        Tournaments testTournaments = tournamentsList.get(tournamentsList.size() - 1);
        assertThat(testTournaments.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testTournaments.getGameType()).isEqualTo(DEFAULT_GAME_TYPE);
        assertThat(testTournaments.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testTournaments.getMaxParticipants()).isEqualTo(DEFAULT_MAX_PARTICIPANTS);
        assertThat(testTournaments.getCurrentParticipants()).isEqualTo(DEFAULT_CURRENT_PARTICIPANTS);
        assertThat(testTournaments.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testTournaments.getTournamentLogo()).isEqualTo(DEFAULT_TOURNAMENT_LOGO);
        assertThat(testTournaments.getTournamentLogoContentType()).isEqualTo(DEFAULT_TOURNAMENT_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createTournamentsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = tournamentsRepository.findAll().size();

        // Create the Tournaments with an existing ID
        tournaments.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTournamentsMockMvc.perform(post("/api/tournaments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tournaments)))
            .andExpect(status().isBadRequest());

        // Validate the Tournaments in the database
        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = tournamentsRepository.findAll().size();
        // set the field null
        tournaments.setName(null);

        // Create the Tournaments, which fails.


        restTournamentsMockMvc.perform(post("/api/tournaments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tournaments)))
            .andExpect(status().isBadRequest());

        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkMaxParticipantsIsRequired() throws Exception {
        int databaseSizeBeforeTest = tournamentsRepository.findAll().size();
        // set the field null
        tournaments.setMaxParticipants(null);

        // Create the Tournaments, which fails.


        restTournamentsMockMvc.perform(post("/api/tournaments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tournaments)))
            .andExpect(status().isBadRequest());

        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStartDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = tournamentsRepository.findAll().size();
        // set the field null
        tournaments.setStartDate(null);

        // Create the Tournaments, which fails.


        restTournamentsMockMvc.perform(post("/api/tournaments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tournaments)))
            .andExpect(status().isBadRequest());

        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTournaments() throws Exception {
        // Initialize the database
        tournamentsRepository.saveAndFlush(tournaments);

        // Get all the tournamentsList
        restTournamentsMockMvc.perform(get("/api/tournaments?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(tournaments.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].gameType").value(hasItem(DEFAULT_GAME_TYPE.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].maxParticipants").value(hasItem(DEFAULT_MAX_PARTICIPANTS)))
            .andExpect(jsonPath("$.[*].currentParticipants").value(hasItem(DEFAULT_CURRENT_PARTICIPANTS)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].tournamentLogoContentType").value(hasItem(DEFAULT_TOURNAMENT_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].tournamentLogo").value(hasItem(Base64Utils.encodeToString(DEFAULT_TOURNAMENT_LOGO))));
    }
    
    @Test
    @Transactional
    public void getTournaments() throws Exception {
        // Initialize the database
        tournamentsRepository.saveAndFlush(tournaments);

        // Get the tournaments
        restTournamentsMockMvc.perform(get("/api/tournaments/{id}", tournaments.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(tournaments.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.gameType").value(DEFAULT_GAME_TYPE.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.maxParticipants").value(DEFAULT_MAX_PARTICIPANTS))
            .andExpect(jsonPath("$.currentParticipants").value(DEFAULT_CURRENT_PARTICIPANTS))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.tournamentLogoContentType").value(DEFAULT_TOURNAMENT_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.tournamentLogo").value(Base64Utils.encodeToString(DEFAULT_TOURNAMENT_LOGO)));
    }
    @Test
    @Transactional
    public void getNonExistingTournaments() throws Exception {
        // Get the tournaments
        restTournamentsMockMvc.perform(get("/api/tournaments/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTournaments() throws Exception {
        // Initialize the database
        tournamentsRepository.saveAndFlush(tournaments);

        int databaseSizeBeforeUpdate = tournamentsRepository.findAll().size();

        // Update the tournaments
        Tournaments updatedTournaments = tournamentsRepository.findById(tournaments.getId()).get();
        // Disconnect from session so that the updates on updatedTournaments are not directly saved in db
        em.detach(updatedTournaments);
        updatedTournaments
            .name(UPDATED_NAME)
            .gameType(UPDATED_GAME_TYPE)
            .description(UPDATED_DESCRIPTION)
            .maxParticipants(UPDATED_MAX_PARTICIPANTS)
            .currentParticipants(UPDATED_CURRENT_PARTICIPANTS)
            .startDate(UPDATED_START_DATE)
            .tournamentLogo(UPDATED_TOURNAMENT_LOGO)
            .tournamentLogoContentType(UPDATED_TOURNAMENT_LOGO_CONTENT_TYPE);

        restTournamentsMockMvc.perform(put("/api/tournaments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTournaments)))
            .andExpect(status().isOk());

        // Validate the Tournaments in the database
        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeUpdate);
        Tournaments testTournaments = tournamentsList.get(tournamentsList.size() - 1);
        assertThat(testTournaments.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testTournaments.getGameType()).isEqualTo(UPDATED_GAME_TYPE);
        assertThat(testTournaments.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testTournaments.getMaxParticipants()).isEqualTo(UPDATED_MAX_PARTICIPANTS);
        assertThat(testTournaments.getCurrentParticipants()).isEqualTo(UPDATED_CURRENT_PARTICIPANTS);
        assertThat(testTournaments.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testTournaments.getTournamentLogo()).isEqualTo(UPDATED_TOURNAMENT_LOGO);
        assertThat(testTournaments.getTournamentLogoContentType()).isEqualTo(UPDATED_TOURNAMENT_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingTournaments() throws Exception {
        int databaseSizeBeforeUpdate = tournamentsRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTournamentsMockMvc.perform(put("/api/tournaments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(tournaments)))
            .andExpect(status().isBadRequest());

        // Validate the Tournaments in the database
        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTournaments() throws Exception {
        // Initialize the database
        tournamentsRepository.saveAndFlush(tournaments);

        int databaseSizeBeforeDelete = tournamentsRepository.findAll().size();

        // Delete the tournaments
        restTournamentsMockMvc.perform(delete("/api/tournaments/{id}", tournaments.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Tournaments> tournamentsList = tournamentsRepository.findAll();
        assertThat(tournamentsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
