package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.EsportsApp;
import com.inzynierka.esports.domain.Teams;
import com.inzynierka.esports.repository.TeamsRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link TeamsResource} REST controller.
 */
@SpringBootTest(classes = EsportsApp.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
public class TeamsResourceIT {

    private static final String DEFAULT_TEAM_NAME = "AAAAAAAAAA";
    private static final String UPDATED_TEAM_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CAPTAIN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_CAPTAIN_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_TEAM_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_TEAM_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_TEAM_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_TEAM_LOGO_CONTENT_TYPE = "image/png";

    @Autowired
    private TeamsRepository teamsRepository;

    @Mock
    private TeamsRepository teamsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restTeamsMockMvc;

    private Teams teams;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teams createEntity(EntityManager em) {
        Teams teams = new Teams()
            .teamName(DEFAULT_TEAM_NAME)
            .captainName(DEFAULT_CAPTAIN_NAME)
            .teamLogo(DEFAULT_TEAM_LOGO)
            .teamLogoContentType(DEFAULT_TEAM_LOGO_CONTENT_TYPE);
        return teams;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Teams createUpdatedEntity(EntityManager em) {
        Teams teams = new Teams()
            .teamName(UPDATED_TEAM_NAME)
            .captainName(UPDATED_CAPTAIN_NAME)
            .teamLogo(UPDATED_TEAM_LOGO)
            .teamLogoContentType(UPDATED_TEAM_LOGO_CONTENT_TYPE);
        return teams;
    }

    @BeforeEach
    public void initTest() {
        teams = createEntity(em);
    }

    @Test
    @Transactional
    public void createTeams() throws Exception {
        int databaseSizeBeforeCreate = teamsRepository.findAll().size();
        // Create the Teams
        restTeamsMockMvc.perform(post("/api/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isCreated());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeCreate + 1);
        Teams testTeams = teamsList.get(teamsList.size() - 1);
        assertThat(testTeams.getTeamName()).isEqualTo(DEFAULT_TEAM_NAME);
        assertThat(testTeams.getCaptainName()).isEqualTo(DEFAULT_CAPTAIN_NAME);
        assertThat(testTeams.getTeamLogo()).isEqualTo(DEFAULT_TEAM_LOGO);
        assertThat(testTeams.getTeamLogoContentType()).isEqualTo(DEFAULT_TEAM_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createTeamsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = teamsRepository.findAll().size();

        // Create the Teams with an existing ID
        teams.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTeamsMockMvc.perform(post("/api/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isBadRequest());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkTeamNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = teamsRepository.findAll().size();
        // set the field null
        teams.setTeamName(null);

        // Create the Teams, which fails.


        restTeamsMockMvc.perform(post("/api/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isBadRequest());

        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCaptainNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = teamsRepository.findAll().size();
        // set the field null
        teams.setCaptainName(null);

        // Create the Teams, which fails.


        restTeamsMockMvc.perform(post("/api/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isBadRequest());

        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        // Get all the teamsList
        restTeamsMockMvc.perform(get("/api/teams?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(teams.getId().intValue())))
            .andExpect(jsonPath("$.[*].teamName").value(hasItem(DEFAULT_TEAM_NAME)))
            .andExpect(jsonPath("$.[*].captainName").value(hasItem(DEFAULT_CAPTAIN_NAME)))
            .andExpect(jsonPath("$.[*].teamLogoContentType").value(hasItem(DEFAULT_TEAM_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].teamLogo").value(hasItem(Base64Utils.encodeToString(DEFAULT_TEAM_LOGO))));
    }
    
    @SuppressWarnings({"unchecked"})
    public void getAllTeamsWithEagerRelationshipsIsEnabled() throws Exception {
        when(teamsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTeamsMockMvc.perform(get("/api/teams?eagerload=true"))
            .andExpect(status().isOk());

        verify(teamsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllTeamsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(teamsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restTeamsMockMvc.perform(get("/api/teams?eagerload=true"))
            .andExpect(status().isOk());

        verify(teamsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        // Get the teams
        restTeamsMockMvc.perform(get("/api/teams/{id}", teams.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(teams.getId().intValue()))
            .andExpect(jsonPath("$.teamName").value(DEFAULT_TEAM_NAME))
            .andExpect(jsonPath("$.captainName").value(DEFAULT_CAPTAIN_NAME))
            .andExpect(jsonPath("$.teamLogoContentType").value(DEFAULT_TEAM_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.teamLogo").value(Base64Utils.encodeToString(DEFAULT_TEAM_LOGO)));
    }
    @Test
    @Transactional
    public void getNonExistingTeams() throws Exception {
        // Get the teams
        restTeamsMockMvc.perform(get("/api/teams/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();

        // Update the teams
        Teams updatedTeams = teamsRepository.findById(teams.getId()).get();
        // Disconnect from session so that the updates on updatedTeams are not directly saved in db
        em.detach(updatedTeams);
        updatedTeams
            .teamName(UPDATED_TEAM_NAME)
            .captainName(UPDATED_CAPTAIN_NAME)
            .teamLogo(UPDATED_TEAM_LOGO)
            .teamLogoContentType(UPDATED_TEAM_LOGO_CONTENT_TYPE);

        restTeamsMockMvc.perform(put("/api/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedTeams)))
            .andExpect(status().isOk());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
        Teams testTeams = teamsList.get(teamsList.size() - 1);
        assertThat(testTeams.getTeamName()).isEqualTo(UPDATED_TEAM_NAME);
        assertThat(testTeams.getCaptainName()).isEqualTo(UPDATED_CAPTAIN_NAME);
        assertThat(testTeams.getTeamLogo()).isEqualTo(UPDATED_TEAM_LOGO);
        assertThat(testTeams.getTeamLogoContentType()).isEqualTo(UPDATED_TEAM_LOGO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingTeams() throws Exception {
        int databaseSizeBeforeUpdate = teamsRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restTeamsMockMvc.perform(put("/api/teams")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(teams)))
            .andExpect(status().isBadRequest());

        // Validate the Teams in the database
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTeams() throws Exception {
        // Initialize the database
        teamsRepository.saveAndFlush(teams);

        int databaseSizeBeforeDelete = teamsRepository.findAll().size();

        // Delete the teams
        restTeamsMockMvc.perform(delete("/api/teams/{id}", teams.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Teams> teamsList = teamsRepository.findAll();
        assertThat(teamsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
