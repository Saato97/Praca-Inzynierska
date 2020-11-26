package com.inzynierka.esports.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.inzynierka.esports.web.rest.TestUtil;

public class TournamentsTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Tournaments.class);
        Tournaments tournaments1 = new Tournaments();
        tournaments1.setId(1L);
        Tournaments tournaments2 = new Tournaments();
        tournaments2.setId(tournaments1.getId());
        assertThat(tournaments1).isEqualTo(tournaments2);
        tournaments2.setId(2L);
        assertThat(tournaments1).isNotEqualTo(tournaments2);
        tournaments1.setId(null);
        assertThat(tournaments1).isNotEqualTo(tournaments2);
    }
}
