package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.EsportsApp;
import com.inzynierka.esports.domain.Organizers;
import com.inzynierka.esports.repository.OrganizersRepository;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link OrganizersResource} REST controller.
 */
@SpringBootTest(classes = EsportsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class OrganizersResourceIT {

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_DISCORD = "AAAAAAAAAA";
    private static final String UPDATED_DISCORD = "BBBBBBBBBB";

    @Autowired
    private OrganizersRepository organizersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOrganizersMockMvc;

    private Organizers organizers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Organizers createEntity(EntityManager em) {
        Organizers organizers = new Organizers()
            .email(DEFAULT_EMAIL)
            .discord(DEFAULT_DISCORD);
        return organizers;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Organizers createUpdatedEntity(EntityManager em) {
        Organizers organizers = new Organizers()
            .email(UPDATED_EMAIL)
            .discord(UPDATED_DISCORD);
        return organizers;
    }

    @BeforeEach
    public void initTest() {
        organizers = createEntity(em);
    }

    @Test
    @Transactional
    public void createOrganizersWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = organizersRepository.findAll().size();

        // Create the Organizers with an existing ID
        organizers.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOrganizersMockMvc.perform(post("/api/organizers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(organizers)))
            .andExpect(status().isBadRequest());

        // Validate the Organizers in the database
        List<Organizers> organizersList = organizersRepository.findAll();
        assertThat(organizersList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllOrganizers() throws Exception {
        // Initialize the database
        organizersRepository.saveAndFlush(organizers);

        // Get all the organizersList
        restOrganizersMockMvc.perform(get("/api/organizers?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(organizers.getId().intValue())))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].discord").value(hasItem(DEFAULT_DISCORD)));
    }
    
    @Test
    @Transactional
    public void getOrganizers() throws Exception {
        // Initialize the database
        organizersRepository.saveAndFlush(organizers);

        // Get the organizers
        restOrganizersMockMvc.perform(get("/api/organizers/{id}", organizers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(organizers.getId().intValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.discord").value(DEFAULT_DISCORD));
    }
    @Test
    @Transactional
    public void getNonExistingOrganizers() throws Exception {
        // Get the organizers
        restOrganizersMockMvc.perform(get("/api/organizers/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOrganizers() throws Exception {
        // Initialize the database
        organizersRepository.saveAndFlush(organizers);

        int databaseSizeBeforeUpdate = organizersRepository.findAll().size();

        // Update the organizers
        Organizers updatedOrganizers = organizersRepository.findById(organizers.getId()).get();
        // Disconnect from session so that the updates on updatedOrganizers are not directly saved in db
        em.detach(updatedOrganizers);
        updatedOrganizers
            .email(UPDATED_EMAIL)
            .discord(UPDATED_DISCORD);

        restOrganizersMockMvc.perform(put("/api/organizers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedOrganizers)))
            .andExpect(status().isOk());

        // Validate the Organizers in the database
        List<Organizers> organizersList = organizersRepository.findAll();
        assertThat(organizersList).hasSize(databaseSizeBeforeUpdate);
        Organizers testOrganizers = organizersList.get(organizersList.size() - 1);
        assertThat(testOrganizers.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testOrganizers.getDiscord()).isEqualTo(UPDATED_DISCORD);
    }

    @Test
    @Transactional
    public void updateNonExistingOrganizers() throws Exception {
        int databaseSizeBeforeUpdate = organizersRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOrganizersMockMvc.perform(put("/api/organizers")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(organizers)))
            .andExpect(status().isBadRequest());

        // Validate the Organizers in the database
        List<Organizers> organizersList = organizersRepository.findAll();
        assertThat(organizersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOrganizers() throws Exception {
        // Initialize the database
        organizersRepository.saveAndFlush(organizers);

        int databaseSizeBeforeDelete = organizersRepository.findAll().size();

        // Delete the organizers
        restOrganizersMockMvc.perform(delete("/api/organizers/{id}", organizers.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Organizers> organizersList = organizersRepository.findAll();
        assertThat(organizersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
