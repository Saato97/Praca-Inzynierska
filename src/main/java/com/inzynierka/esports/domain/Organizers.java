package com.inzynierka.esports.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;

/**
 * A Organizers.
 */
@Entity
@Table(name = "organizers")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Organizers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "discord")
    private String discord;

    @OneToOne
    @JoinColumn(unique = true)
    private ApplicationUsers applicationUsers;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public Organizers email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDiscord() {
        return discord;
    }

    public Organizers discord(String discord) {
        this.discord = discord;
        return this;
    }

    public void setDiscord(String discord) {
        this.discord = discord;
    }

    public ApplicationUsers getApplicationUsers() {
        return applicationUsers;
    }

    public Organizers applicationUsers(ApplicationUsers applicationUsers) {
        this.applicationUsers = applicationUsers;
        return this;
    }

    public void setApplicationUsers(ApplicationUsers applicationUsers) {
        this.applicationUsers = applicationUsers;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Organizers)) {
            return false;
        }
        return id != null && id.equals(((Organizers) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Organizers{" +
            "id=" + getId() +
            ", email='" + getEmail() + "'" +
            ", discord='" + getDiscord() + "'" +
            "}";
    }
}
