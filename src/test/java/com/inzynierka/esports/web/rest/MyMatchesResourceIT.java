package com.inzynierka.esports.web.rest;

import com.inzynierka.esports.EsportsApp;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
/**
 * Test class for the MyMatchesResource REST controller.
 *
 * @see MyMatchesResource
 */
@SpringBootTest(classes = EsportsApp.class)
public class MyMatchesResourceIT {

    private MockMvc restMockMvc;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);

        MyMatchesResource myMatchesResource = new MyMatchesResource(null, null);
        restMockMvc = MockMvcBuilders
            .standaloneSetup(myMatchesResource)
            .build();
    }
}
