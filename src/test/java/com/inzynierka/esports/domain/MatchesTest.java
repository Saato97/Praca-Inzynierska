package com.inzynierka.esports.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.inzynierka.esports.web.rest.TestUtil;

public class MatchesTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Matches.class);
        Matches matches1 = new Matches();
        matches1.setId(1L);
        Matches matches2 = new Matches();
        matches2.setId(matches1.getId());
        assertThat(matches1).isEqualTo(matches2);
        matches2.setId(2L);
        assertThat(matches1).isNotEqualTo(matches2);
        matches1.setId(null);
        assertThat(matches1).isNotEqualTo(matches2);
    }
}
