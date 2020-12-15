package com.inzynierka.esports.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.inzynierka.esports.domain.enumeration.Games;

/**
 * A Tournaments.
 */
@Entity
@Table(name = "tournaments")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Tournaments implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "game_type")
    private Games gameType;

    @Lob
    @Type(type = "org.hibernate.type.TextType")
    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "max_participants", nullable = false)
    private Integer maxParticipants;

    @Column(name = "current_participants")
    private Integer currentParticipants;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @Lob
    @Column(name = "tournament_logo")
    private byte[] tournamentLogo;

    @Column(name = "tournament_logo_content_type")
    private String tournamentLogoContentType;

    @Column(name = "status")
    private String status;

    @OneToMany(mappedBy = "tournaments")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Teams> teams = new HashSet<>();

    @OneToMany(mappedBy = "tournaments")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Matches> matches = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = "tournaments", allowSetters = true)
    private Organizers organizers;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Tournaments name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Games getGameType() {
        return gameType;
    }

    public Tournaments gameType(Games gameType) {
        this.gameType = gameType;
        return this;
    }

    public void setGameType(Games gameType) {
        this.gameType = gameType;
    }

    public String getDescription() {
        return description;
    }

    public Tournaments description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public Tournaments maxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
        return this;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public Integer getCurrentParticipants() {
        return currentParticipants;
    }

    public Tournaments currentParticipants(Integer currentParticipants) {
        this.currentParticipants = currentParticipants;
        return this;
    }

    public void setCurrentParticipants(Integer currentParticipants) {
        this.currentParticipants = currentParticipants;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public Tournaments startDate(Instant startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public byte[] getTournamentLogo() {
        return tournamentLogo;
    }

    public Tournaments tournamentLogo(byte[] tournamentLogo) {
        this.tournamentLogo = tournamentLogo;
        return this;
    }

    public void setTournamentLogo(byte[] tournamentLogo) {
        this.tournamentLogo = tournamentLogo;
    }

    public String getTournamentLogoContentType() {
        return tournamentLogoContentType;
    }

    public Tournaments tournamentLogoContentType(String tournamentLogoContentType) {
        this.tournamentLogoContentType = tournamentLogoContentType;
        return this;
    }

    public void setTournamentLogoContentType(String tournamentLogoContentType) {
        this.tournamentLogoContentType = tournamentLogoContentType;
    }

    public String getStatus() {
        return status;
    }

    public Tournaments status(String status) {
        this.status = status;
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<Teams> getTeams() {
        return teams;
    }

    public Tournaments teams(Set<Teams> teams) {
        this.teams = teams;
        return this;
    }

    public Tournaments addTeams(Teams teams) {
        this.teams.add(teams);
        teams.setTournaments(this);
        return this;
    }

    public Tournaments removeTeams(Teams teams) {
        this.teams.remove(teams);
        teams.setTournaments(null);
        return this;
    }

    public void setTeams(Set<Teams> teams) {
        this.teams = teams;
    }

    public Set<Matches> getMatches() {
        return matches;
    }

    public Tournaments matches(Set<Matches> matches) {
        this.matches = matches;
        return this;
    }

    public Tournaments addMatches(Matches matches) {
        this.matches.add(matches);
        matches.setTournaments(this);
        return this;
    }

    public Tournaments removeMatches(Matches matches) {
        this.matches.remove(matches);
        matches.setTournaments(null);
        return this;
    }

    public void setMatches(Set<Matches> matches) {
        this.matches = matches;
    }

    public Organizers getOrganizers() {
        return organizers;
    }

    public Tournaments organizers(Organizers organizers) {
        this.organizers = organizers;
        return this;
    }

    public void setOrganizers(Organizers organizers) {
        this.organizers = organizers;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tournaments)) {
            return false;
        }
        return id != null && id.equals(((Tournaments) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tournaments{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", gameType='" + getGameType() + "'" +
            ", description='" + getDescription() + "'" +
            ", maxParticipants=" + getMaxParticipants() +
            ", currentParticipants=" + getCurrentParticipants() +
            ", startDate='" + getStartDate() + "'" +
            ", tournamentLogo='" + getTournamentLogo() + "'" +
            ", tournamentLogoContentType='" + getTournamentLogoContentType() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
