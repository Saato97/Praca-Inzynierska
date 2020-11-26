package com.inzynierka.esports.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Teams.
 */
@Entity
@Table(name = "teams")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Teams implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "team_name", nullable = false)
    private String teamName;

    @NotNull
    @Column(name = "captain_name", nullable = false)
    private String captainName;

    @Lob
    @Column(name = "team_logo")
    private byte[] teamLogo;

    @Column(name = "team_logo_content_type")
    private String teamLogoContentType;

    @OneToMany(mappedBy = "teams")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Tournaments> tournaments = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "teams_application_users",
               joinColumns = @JoinColumn(name = "teams_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "application_users_id", referencedColumnName = "id"))
    private Set<ApplicationUsers> applicationUsers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "teams", allowSetters = true)
    private Matches matches;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeamName() {
        return teamName;
    }

    public Teams teamName(String teamName) {
        this.teamName = teamName;
        return this;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getCaptainName() {
        return captainName;
    }

    public Teams captainName(String captainName) {
        this.captainName = captainName;
        return this;
    }

    public void setCaptainName(String captainName) {
        this.captainName = captainName;
    }

    public byte[] getTeamLogo() {
        return teamLogo;
    }

    public Teams teamLogo(byte[] teamLogo) {
        this.teamLogo = teamLogo;
        return this;
    }

    public void setTeamLogo(byte[] teamLogo) {
        this.teamLogo = teamLogo;
    }

    public String getTeamLogoContentType() {
        return teamLogoContentType;
    }

    public Teams teamLogoContentType(String teamLogoContentType) {
        this.teamLogoContentType = teamLogoContentType;
        return this;
    }

    public void setTeamLogoContentType(String teamLogoContentType) {
        this.teamLogoContentType = teamLogoContentType;
    }

    public Set<Tournaments> getTournaments() {
        return tournaments;
    }

    public Teams tournaments(Set<Tournaments> tournaments) {
        this.tournaments = tournaments;
        return this;
    }

    public Teams addTournaments(Tournaments tournaments) {
        this.tournaments.add(tournaments);
        tournaments.setTeams(this);
        return this;
    }

    public Teams removeTournaments(Tournaments tournaments) {
        this.tournaments.remove(tournaments);
        tournaments.setTeams(null);
        return this;
    }

    public void setTournaments(Set<Tournaments> tournaments) {
        this.tournaments = tournaments;
    }

    public Set<ApplicationUsers> getApplicationUsers() {
        return applicationUsers;
    }

    public Teams applicationUsers(Set<ApplicationUsers> applicationUsers) {
        this.applicationUsers = applicationUsers;
        return this;
    }

    public Teams addApplicationUsers(ApplicationUsers applicationUsers) {
        this.applicationUsers.add(applicationUsers);
        applicationUsers.getTeams().add(this);
        return this;
    }

    public Teams removeApplicationUsers(ApplicationUsers applicationUsers) {
        this.applicationUsers.remove(applicationUsers);
        applicationUsers.getTeams().remove(this);
        return this;
    }

    public void setApplicationUsers(Set<ApplicationUsers> applicationUsers) {
        this.applicationUsers = applicationUsers;
    }

    public Matches getMatches() {
        return matches;
    }

    public Teams matches(Matches matches) {
        this.matches = matches;
        return this;
    }

    public void setMatches(Matches matches) {
        this.matches = matches;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Teams)) {
            return false;
        }
        return id != null && id.equals(((Teams) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Teams{" +
            "id=" + getId() +
            ", teamName='" + getTeamName() + "'" +
            ", captainName='" + getCaptainName() + "'" +
            ", teamLogo='" + getTeamLogo() + "'" +
            ", teamLogoContentType='" + getTeamLogoContentType() + "'" +
            "}";
    }
}
