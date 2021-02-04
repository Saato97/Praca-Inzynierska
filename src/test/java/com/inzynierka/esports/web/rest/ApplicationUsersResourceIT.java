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
    public void getNonExistingApplicationUsers() throws Exception {
        // Get the applicationUsers
        restApplicationUsersMockMvc.perform(get("/api/application-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
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
}
