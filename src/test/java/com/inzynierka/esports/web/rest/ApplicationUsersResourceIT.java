package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.EsportsApp;
import com.inzynierka.esports.domain.ApplicationUsers;
import com.inzynierka.esports.repository.ApplicationUsersRepository;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link ApplicationUsersResource} REST controller.
 */
@SpringBootTest(classes = EsportsApp.class)
@AutoConfigureMockMvc
@WithMockUser
public class ApplicationUsersResourceIT {

    private static final Long DEFAULT_LEVEL = 1L;
    private static final Long UPDATED_LEVEL = 2L;

    private static final Long DEFAULT_POINTS = 1L;
    private static final Long UPDATED_POINTS = 2L;

    private static final byte[] DEFAULT_USER_LOGO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_USER_LOGO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_USER_LOGO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_USER_LOGO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    @Autowired
    private ApplicationUsersRepository applicationUsersRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restApplicationUsersMockMvc;

    private ApplicationUsers applicationUsers;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUsers createEntity(EntityManager em) {
        ApplicationUsers applicationUsers = new ApplicationUsers()
            .level(DEFAULT_LEVEL)
            .points(DEFAULT_POINTS)
            .userLogo(DEFAULT_USER_LOGO)
            .userLogoContentType(DEFAULT_USER_LOGO_CONTENT_TYPE)
            .username(DEFAULT_USERNAME);
        return applicationUsers;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ApplicationUsers createUpdatedEntity(EntityManager em) {
        ApplicationUsers applicationUsers = new ApplicationUsers()
            .level(UPDATED_LEVEL)
            .points(UPDATED_POINTS)
            .userLogo(UPDATED_USER_LOGO)
            .userLogoContentType(UPDATED_USER_LOGO_CONTENT_TYPE)
            .username(UPDATED_USERNAME);
        return applicationUsers;
    }

    @BeforeEach
    public void initTest() {
        applicationUsers = createEntity(em);
    }

    @Test
    @Transactional
    public void createApplicationUsers() throws Exception {
        int databaseSizeBeforeCreate = applicationUsersRepository.findAll().size();
        // Create the ApplicationUsers
        restApplicationUsersMockMvc.perform(post("/api/application-users")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(applicationUsers)))
            .andExpect(status().isCreated());

        // Validate the ApplicationUsers in the database
        List<ApplicationUsers> applicationUsersList = applicationUsersRepository.findAll();
        assertThat(applicationUsersList).hasSize(databaseSizeBeforeCreate + 1);
        ApplicationUsers testApplicationUsers = applicationUsersList.get(applicationUsersList.size() - 1);
        assertThat(testApplicationUsers.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testApplicationUsers.getPoints()).isEqualTo(DEFAULT_POINTS);
        assertThat(testApplicationUsers.getUserLogo()).isEqualTo(DEFAULT_USER_LOGO);
        assertThat(testApplicationUsers.getUserLogoContentType()).isEqualTo(DEFAULT_USER_LOGO_CONTENT_TYPE);
        assertThat(testApplicationUsers.getUsername()).isEqualTo(DEFAULT_USERNAME);
    }

    @Test
    @Transactional
    public void createApplicationUsersWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = applicationUsersRepository.findAll().size();

        // Create the ApplicationUsers with an existing ID
        applicationUsers.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restApplicationUsersMockMvc.perform(post("/api/application-users")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(applicationUsers)))
            .andExpect(status().isBadRequest());

        // Validate the ApplicationUsers in the database
        List<ApplicationUsers> applicationUsersList = applicationUsersRepository.findAll();
        assertThat(applicationUsersList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllApplicationUsers() throws Exception {
        // Initialize the database
        applicationUsersRepository.saveAndFlush(applicationUsers);

        // Get all the applicationUsersList
        restApplicationUsersMockMvc.perform(get("/api/application-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(applicationUsers.getId().intValue())))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL.intValue())))
            .andExpect(jsonPath("$.[*].points").value(hasItem(DEFAULT_POINTS.intValue())))
            .andExpect(jsonPath("$.[*].userLogoContentType").value(hasItem(DEFAULT_USER_LOGO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].userLogo").value(hasItem(Base64Utils.encodeToString(DEFAULT_USER_LOGO))))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)));
    }
    
    @Test
    @Transactional
    public void getApplicationUsers() throws Exception {
        // Initialize the database
        applicationUsersRepository.saveAndFlush(applicationUsers);

        // Get the applicationUsers
        restApplicationUsersMockMvc.perform(get("/api/application-users/{id}", applicationUsers.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(applicationUsers.getId().intValue()))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL.intValue()))
            .andExpect(jsonPath("$.points").value(DEFAULT_POINTS.intValue()))
            .andExpect(jsonPath("$.userLogoContentType").value(DEFAULT_USER_LOGO_CONTENT_TYPE))
            .andExpect(jsonPath("$.userLogo").value(Base64Utils.encodeToString(DEFAULT_USER_LOGO)))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME));
    }
    @Test
    @Transactional
    public void getNonExistingApplicationUsers() throws Exception {
        // Get the applicationUsers
        restApplicationUsersMockMvc.perform(get("/api/application-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateApplicationUsers() throws Exception {
        // Initialize the database
        applicationUsersRepository.saveAndFlush(applicationUsers);

        int databaseSizeBeforeUpdate = applicationUsersRepository.findAll().size();

        // Update the applicationUsers
        ApplicationUsers updatedApplicationUsers = applicationUsersRepository.findById(applicationUsers.getId()).get();
        // Disconnect from session so that the updates on updatedApplicationUsers are not directly saved in db
        em.detach(updatedApplicationUsers);
        updatedApplicationUsers
            .level(UPDATED_LEVEL)
            .points(UPDATED_POINTS)
            .userLogo(UPDATED_USER_LOGO)
            .userLogoContentType(UPDATED_USER_LOGO_CONTENT_TYPE)
            .username(UPDATED_USERNAME);

        restApplicationUsersMockMvc.perform(put("/api/application-users")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedApplicationUsers)))
            .andExpect(status().isOk());

        // Validate the ApplicationUsers in the database
        List<ApplicationUsers> applicationUsersList = applicationUsersRepository.findAll();
        assertThat(applicationUsersList).hasSize(databaseSizeBeforeUpdate);
        ApplicationUsers testApplicationUsers = applicationUsersList.get(applicationUsersList.size() - 1);
        assertThat(testApplicationUsers.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testApplicationUsers.getPoints()).isEqualTo(UPDATED_POINTS);
        assertThat(testApplicationUsers.getUserLogo()).isEqualTo(UPDATED_USER_LOGO);
        assertThat(testApplicationUsers.getUserLogoContentType()).isEqualTo(UPDATED_USER_LOGO_CONTENT_TYPE);
        assertThat(testApplicationUsers.getUsername()).isEqualTo(UPDATED_USERNAME);
    }

    @Test
    @Transactional
    public void updateNonExistingApplicationUsers() throws Exception {
        int databaseSizeBeforeUpdate = applicationUsersRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restApplicationUsersMockMvc.perform(put("/api/application-users")
            .contentType(MediaType.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(applicationUsers)))
            .andExpect(status().isBadRequest());

        // Validate the ApplicationUsers in the database
        List<ApplicationUsers> applicationUsersList = applicationUsersRepository.findAll();
        assertThat(applicationUsersList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteApplicationUsers() throws Exception {
        // Initialize the database
        applicationUsersRepository.saveAndFlush(applicationUsers);

        int databaseSizeBeforeDelete = applicationUsersRepository.findAll().size();

        // Delete the applicationUsers
        restApplicationUsersMockMvc.perform(delete("/api/application-users/{id}", applicationUsers.getId())
            .accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ApplicationUsers> applicationUsersList = applicationUsersRepository.findAll();
        assertThat(applicationUsersList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
