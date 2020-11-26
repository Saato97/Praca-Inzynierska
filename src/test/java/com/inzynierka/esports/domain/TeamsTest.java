package com.inzynierka.esports.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.inzynierka.esports.web.rest.TestUtil;

public class TeamsTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Teams.class);
        Teams teams1 = new Teams();
        teams1.setId(1L);
        Teams teams2 = new Teams();
        teams2.setId(teams1.getId());
        assertThat(teams1).isEqualTo(teams2);
        teams2.setId(2L);
        assertThat(teams1).isNotEqualTo(teams2);
        teams1.setId(null);
        assertThat(teams1).isNotEqualTo(teams2);
    }
}
