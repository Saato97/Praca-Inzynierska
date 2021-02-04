package com.inzynierka.esports.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Game.
 */
@Entity
@Table(name = "game")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Game implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "team_size")
    private Integer teamSize;

    @OneToMany(mappedBy = "game")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Tournaments> tournaments = new HashSet<>();

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

    public Game name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public Game teamSize(Integer teamSize) {
        this.teamSize = teamSize;
        return this;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public Set<Tournaments> getTournaments() {
        return tournaments;
    }

    public Game tournaments(Set<Tournaments> tournaments) {
        this.tournaments = tournaments;
        return this;
    }

    public Game addTournaments(Tournaments tournaments) {
        this.tournaments.add(tournaments);
        tournaments.setGame(this);
        return this;
    }

    public Game removeTournaments(Tournaments tournaments) {
        this.tournaments.remove(tournaments);
        tournaments.setGame(null);
        return this;
    }

    public void setTournaments(Set<Tournaments> tournaments) {
        this.tournaments = tournaments;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Game)) {
            return false;
        }
        return id != null && id.equals(((Game) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Game{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", teamSize=" + getTeamSize() +
            "}";
    }
}
