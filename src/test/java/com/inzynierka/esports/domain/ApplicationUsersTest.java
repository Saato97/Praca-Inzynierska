package com.inzynierka.esports.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.inzynierka.esports.web.rest.TestUtil;

public class ApplicationUsersTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ApplicationUsers.class);
        ApplicationUsers applicationUsers1 = new ApplicationUsers();
        applicationUsers1.setId(1L);
        ApplicationUsers applicationUsers2 = new ApplicationUsers();
        applicationUsers2.setId(applicationUsers1.getId());
        assertThat(applicationUsers1).isEqualTo(applicationUsers2);
        applicationUsers2.setId(2L);
        assertThat(applicationUsers1).isNotEqualTo(applicationUsers2);
        applicationUsers1.setId(null);
        assertThat(applicationUsers1).isNotEqualTo(applicationUsers2);
    }
}
