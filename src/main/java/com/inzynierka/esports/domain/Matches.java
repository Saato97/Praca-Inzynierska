package com.inzynierka.esports.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Matches.
 */
@Entity
@Table(name = "matches")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Matches implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "team_a")
    private Long teamA;

    @Column(name = "team_b")
    private Long teamB;

    @Column(name = "winner")
    private Long winner;

    @Column(name = "match_url")
    private String matchUrl;

    @OneToMany(mappedBy = "matches")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Tournaments> tournaments = new HashSet<>();

    @OneToMany(mappedBy = "matches")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Teams> teams = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public Matches startDate(Instant startDate) {
        this.startDate = startDate;
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Long getTeamA() {
        return teamA;
    }

    public Matches teamA(Long teamA) {
        this.teamA = teamA;
        return this;
    }

    public void setTeamA(Long teamA) {
        this.teamA = teamA;
    }

    public Long getTeamB() {
        return teamB;
    }

    public Matches teamB(Long teamB) {
        this.teamB = teamB;
        return this;
    }

    public void setTeamB(Long teamB) {
        this.teamB = teamB;
    }

    public Long getWinner() {
        return winner;
    }

    public Matches winner(Long winner) {
        this.winner = winner;
        return this;
    }

    public void setWinner(Long winner) {
        this.winner = winner;
    }

    public String getMatchUrl() {
        return matchUrl;
    }

    public Matches matchUrl(String matchUrl) {
        this.matchUrl = matchUrl;
        return this;
    }

    public void setMatchUrl(String matchUrl) {
        this.matchUrl = matchUrl;
    }

    public Set<Tournaments> getTournaments() {
        return tournaments;
    }

    public Matches tournaments(Set<Tournaments> tournaments) {
        this.tournaments = tournaments;
        return this;
    }

    public Matches addTournaments(Tournaments tournaments) {
        this.tournaments.add(tournaments);
        tournaments.setMatches(this);
        return this;
    }

    public Matches removeTournaments(Tournaments tournaments) {
        this.tournaments.remove(tournaments);
        tournaments.setMatches(null);
        return this;
    }

    public void setTournaments(Set<Tournaments> tournaments) {
        this.tournaments = tournaments;
    }

    public Set<Teams> getTeams() {
        return teams;
    }

    public Matches teams(Set<Teams> teams) {
        this.teams = teams;
        return this;
    }

    public Matches addTeams(Teams teams) {
        this.teams.add(teams);
        teams.setMatches(this);
        return this;
    }

    public Matches removeTeams(Teams teams) {
        this.teams.remove(teams);
        teams.setMatches(null);
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
        if (!(o instanceof Matches)) {
            return false;
        }
        return id != null && id.equals(((Matches) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Matches{" +
            "id=" + getId() +
            ", startDate='" + getStartDate() + "'" +
            ", teamA=" + getTeamA() +
            ", teamB=" + getTeamB() +
            ", winner=" + getWinner() +
            ", matchUrl='" + getMatchUrl() + "'" +
            "}";
    }
}
