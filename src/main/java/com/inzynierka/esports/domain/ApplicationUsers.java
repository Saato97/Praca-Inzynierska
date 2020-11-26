package com.inzynierka.esports.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A ApplicationUsers.
 */
@Entity
@Table(name = "application_users")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ApplicationUsers implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @Min(value = 1L)
    @Max(value = 100L)
    @Column(name = "level")
    private Long level;

    @Column(name = "points")
    private Long points;

    @Lob
    @Column(name = "user_logo")
    private byte[] userLogo;

    @Column(name = "user_logo_content_type")
    private String userLogoContentType;

    @OneToOne
    @MapsId("id")
    //@JoinColumn(unique = true)
    private User internalUser;

    @ManyToMany(mappedBy = "applicationUsers")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnore
    private Set<Teams> teams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getLevel() {
        return level;
    }

    public ApplicationUsers level(Long level) {
        this.level = level;
        return this;
    }

    public void setLevel(Long level) {
        this.level = level;
    }

    public Long getPoints() {
        return points;
    }

    public ApplicationUsers points(Long points) {
        this.points = points;
        return this;
    }

    public void setPoints(Long points) {
        this.points = points;
    }

    public byte[] getUserLogo() {
        return userLogo;
    }

    public ApplicationUsers userLogo(byte[] userLogo) {
        this.userLogo = userLogo;
        return this;
    }

    public void setUserLogo(byte[] userLogo) {
        this.userLogo = userLogo;
    }

    public String getUserLogoContentType() {
        return userLogoContentType;
    }

    public ApplicationUsers userLogoContentType(String userLogoContentType) {
        this.userLogoContentType = userLogoContentType;
        return this;
    }

    public void setUserLogoContentType(String userLogoContentType) {
        this.userLogoContentType = userLogoContentType;
    }

    public User getInternalUser() {
        return internalUser;
    }

    public ApplicationUsers internalUser(User user) {
        this.internalUser = user;
        return this;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public Set<Teams> getTeams() {
        return teams;
    }

    public ApplicationUsers teams(Set<Teams> teams) {
        this.teams = teams;
        return this;
    }

    public ApplicationUsers addTeams(Teams teams) {
        this.teams.add(teams);
        teams.getApplicationUsers().add(this);
        return this;
    }

    public ApplicationUsers removeTeams(Teams teams) {
        this.teams.remove(teams);
        teams.getApplicationUsers().remove(this);
        return this;
    }

    public void setTeams(Set<Teams> teams) {
        this.teams = teams;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUsers)) {
            return false;
        }
        return id != null && id.equals(((ApplicationUsers) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUsers{" +
            "id=" + getId() +
            ", level=" + getLevel() +
            ", points=" + getPoints() +
            ", userLogo='" + getUserLogo() + "'" +
            ", userLogoContentType='" + getUserLogoContentType() + "'" +
            "}";
    }
}
