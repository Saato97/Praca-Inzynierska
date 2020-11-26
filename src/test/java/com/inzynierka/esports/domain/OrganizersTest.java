package com.inzynierka.esports.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.inzynierka.esports.web.rest.TestUtil;

public class OrganizersTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Organizers.class);
        Organizers organizers1 = new Organizers();
        organizers1.setId(1L);
        Organizers organizers2 = new Organizers();
        organizers2.setId(organizers1.getId());
        assertThat(organizers1).isEqualTo(organizers2);
        organizers2.setId(2L);
        assertThat(organizers1).isNotEqualTo(organizers2);
        organizers1.setId(null);
        assertThat(organizers1).isNotEqualTo(organizers2);
    }
}
