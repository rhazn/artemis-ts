import {Manager} from "./../core/Manager";
import {Bag} from "./../utils/Bag";
import {HashMap} from "./../utils/HashMap";
import {Map} from "./../utils/Map";
import {ImmutableBag} from "./../utils/ImmutableBag";
/**
 * Use this class together with PlayerManager.
 *
 * You may sometimes want to create teams in your game, so that
 * some players are team mates.
 *
 * A player can only belong to a single team.
 *
 * @author Arni Arent
 *
 */
export class TeamManager extends Manager {
    private playersByTeam_: Map<string, Bag<string>>;
    private teamByPlayer_: Map<string, string>;

    constructor() {
        super();
        this.playersByTeam_ = new HashMap<string, Bag<string>>();
        this.teamByPlayer_ = new HashMap<string, string>();
    }

    public initialize() {}

    public getTeam(player: string): string {
        return this.teamByPlayer_.get(player);
    }

    public setTeam(player: string, team: string) {
        this.removeFromTeam(player);

        this.teamByPlayer_.put(player, team);

        let players: Bag<string> = this.playersByTeam_.get(team);
        if (players == null) {
            players = new Bag<string>();
            this.playersByTeam_.put(team, players);
        }
        players.add(player);
    }

    public getPlayers(team: string): ImmutableBag<string> {
        return this.playersByTeam_.get(team);
    }

    public removeFromTeam(player: string) {
        const team: string = this.teamByPlayer_.remove(player);
        if (team != null) {
            const players: Bag<string> = this.playersByTeam_.get(team);
            if (players != null) {
                players.remove(player);
            }
        }
    }
}
