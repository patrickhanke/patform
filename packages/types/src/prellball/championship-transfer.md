# Championship transfer (prellball → patstore)

This is the field map for moving the old prellball Parse classes into the patstore `Championship` class. Nested rows are JSON on the championship. They are no longer their own classes.

The admin playground under Prellball writes this shape. Nested game, group, and sign-up ids stay the old objectIds. Class rows (Category, Location, Club, Person, Article, Image, Download, User, Championship) get a new objectId and store the old one in `former_id`.

## Target class

Parse class: `Championship`

| Field | Parse type | Source |
| --- | --- | --- |
| `title` | String | `Wettkaempfe.titel` |
| `text` | String | `Wettkaempfe.info` |
| `documents` | Array of String | Download objectIds. See Downloads below. |
| `gallery` | Array of String | Image objectIds. See Galerie below. |
| `categories` | Array of String | Season category id, championship-type category id, and the Article objectId. A season is a `Category` with `key` `season`. |
| `former_id` | String | Old `Wettkaempfe.objectId`. New rows get a new objectId. |
| `category` | String | `Wettkaempfe.kategorie`: `Meisterschaften`, `Bundesliga`, `Regionalmeisterschaften`, `Turniere` |
| `short` | String | `Wettkaempfe.wettkampf` |
| `slug` | String | `Wettkaempfe.slug` |
| `group_mode` | Boolean | `Wettkaempfe.gruppenmodus` |
| `data.division` | Array of String | `Wettkaempfe.spielklassen`. If an entry is `{ value, label }`, store `value`. |
| `secondary_teams` | Boolean | `Wettkaempfe.zweitmannschaft` |
| `legacy_mode` | Boolean | `Wettkaempfe.legacy_mode`. Only rows with `legacy_mode` false and a season of 2023/2024 or later are transferred. |
| `settings` | Object | See below. |
| `data` | Object | `{ match_days, sign_ups, groups, games }` |

Also set the usual patstore fields when creating the row: `project` pointer, `module` pointer, `label` (same as `title`), `created_by` / `updated_by`.

The old overview was three lists (`Meisterschaften`, `Bundesliga`, `Regionalmeisterschaften`) plus Turniere. They are one `Championship` overview. `category` keeps the distinction.

### `settings`

Do not put `info` or `downloads` here.

| Field | Source |
| --- | --- |
| `deadline` | `Wettkaempfe.meldefrist` ISO string |
| `show_division` | `Wettkaempfe.show_class` |
| `ak_games` | `Wettkaempfe.ak_games` |
| `staff_lead_id` | New `User` objectId. The old `staffelleitung` user is copied into patstore `User` (`email` becomes `username` and `email`, the old `username` is split into `first_name` and `last_name`). |
| `email` | `Wettkaempfe.email` |
| `open_signup` | `Wettkaempfe.offene_meldung` |

`leitung` was not saved by the old settings form. Leave it out.

## `data.match_days`

Source class: `Spieltage`, previously a relation on `Wettkaempfe.spieltage`.

| Field | Source |
| --- | --- |
| `id` | `Spieltage.objectId` |
| `number` | `spieltagNr` |
| `date` | `datum` ISO string |
| `club_id` | `ausrichter.objectId`, after `Vereine` → `Club` |
| `location_id` | `spielort.objectId`, after `Hallen` → `Location` |
| `fields` | `felder` (number) |
| `contact` | `kontakt` |
| `passes` | `durchgaenge` |
| `breaks` | `pausen` as `[{ pass, duration }]`. Drop the field if `pausen` is empty. |

Do not copy `Spieltage.downloads`. That column is gone.

`tabellen` belonged to the results view, which is not in the editor. Omit it.

## `data.sign_ups`

Source class: `Meldungen`, previously a relation on `Wettkaempfe.meldungen`.

| Field | Source |
| --- | --- |
| `id` | `Meldungen.objectId` |
| `division` | `spielklasse` |
| `status` | `status` (`erstellt`, `eingeladen`, `eingereicht`, `gemeldet`, `abgelehnt`) |
| `active` | `aktiv` |
| `number` | `nummer` |
| `position` | `position` |
| `club_id` | `verein.objectId` → Club |
| `person_ids` | `spieler` relation → Person objectIds |
| `coach_ids` | `betreuer` relation → Person objectIds |
| `referee_ids` | `schiedsrichter` relation → Person objectIds |
| `captain_id` | `spielfuehrer` |
| `comment` | `kommentar` |

Do not copy `gruppe` or `untergruppe` onto the sign-up. Put the sign-up id into the matching subgroup instead. The editor assigns teams from the group, not from the team row.

Drop `saison` and `wettkampf` pointers. Both are implied by the parent championship.

## `data.groups`

Source class: `Gruppen`.

| Field | Source |
| --- | --- |
| `id` | `Gruppen.objectId` |
| `name` | `name` |
| `mode` | `spielmodus.value` (`gruppe` or `kreuz`) |
| `color` | `farbe` |
| `subgroups` | `untergruppen` |

Each subgroup:

| Field | Source |
| --- | --- |
| `id` | `untergruppen[].id` (keep it; games point at it) |
| `label` | `untergruppen[].label` |
| `signup_ids` | `untergruppen[].meldungen` (Meldungen objectIds) |

The old group also had a `meldungen` relation. The subgroup arrays are the source of truth. Ignore the relation when it disagrees with `untergruppen`.

`erstellt` is not shown in the new editor. Omit it.

## `data.games`

Source class: `Games`.

| Field | Source |
| --- | --- |
| `id` | `Games.objectId` |
| `type` | `type` (`grp`, `krz`, `plz`, `ent`, `akk`) |
| `game_nr` | `spielNr` |
| `round` | `round` |
| `field` | `feld` |
| `pass` | `durchgang` |
| `placement` | `placement` number array |
| `group_id` | `group.objectId` |
| `match_day_id` | `spieltag.objectId` |
| `team1_group` / `team2_group` / `referee_group` | subgroup id |
| `team1_index` / `team2_index` / `referee_index` | keep as-is. These are **1-based** indexes into that subgroup's `signup_ids`. |
| `team1_game_id` / `team2_game_id` / `referee_game_id` | `team1_game` / `team2_game` / `referee_game` objectId |
| `half1` / `half2` | `hz1` / `hz2` |
| `score1` / `score2` | `ergebnis1` / `ergebnis2` |
| `winner_signup_id` / `loser_signup_id` | `winner` / `loser` Meldungen objectIds |

`referee_group` / `referee_index` stay the team slot. The person who refereed a game is stored only on `Person.data.referee`, not on the game.

Each subgroup can also store `standings` and `closed`. The results editor recalculates those from the games (2 points for a win, 1 for a draw, decider games type `ent`) and saves them on `data.groups`.

Skip the old Spielplan document. It was a view over these games.

## Related classes

### Club (exists)

Source: `Vereine`. Preserve `objectId` if possible so `club_id` values match.

| Club | Vereine |
| --- | --- |
| `title` | `name` |
| `settings.contact` | `kontakt` |
| `settings.email` | `email` |
| `settings.homepage` | `homepage` |
| `settings.short` | `kurz` |
| `file` | `logo` as a Parse File `{ name, url }`, not an Image id |
| `data.training_times` | `training` rows: title, weekday, start/end hours and minutes, `classes` from Spielklassen, `location_id` from Halle → Location |

Players are `Person` records whose `categories` include the club id.

### Location (exists)

Source: `Hallen`.

| Location | Hallen |
| --- | --- |
| `title` | `name` |
| `address` | `address` |
| `description` | optional notes |

### Person (exists)

Source: `Spieler`. Championship player edits are saved to `Person.data`, not to a Spieler class.

| Person | Spieler |
| --- | --- |
| `name` | `username` |
| `portrait` | `portrait` as an Image objectId |
| `email` | email, if present |
| `data.dtb_id` | `dtb_id` |
| `data.birth_date` | `geb_datum` |
| `data.id_confirmed` | `id_confirmed` |
| `data.club_id` | `verein.objectId` → Club |
| `data.username` | `username`, if you also want it inside `data` |
| `data[season][clubId].games` | game ids played for that club in that season. The results editor writes this when a player is toggled on a game. |
| `data.referee` | game ids this person refereed |

Map the old `spiele[season][wettkampfId].spiele` list into `data[season][clubId].games` using the club of that sign-up.

### Article, Download, Image (exist)

- `Artikel` → `Article`. Store the new objectId inside `Championship.categories`.
- Championship `downloads`: upload each file as a `Download` and store the new ids on `Championship.documents`. Do not copy Spieltag downloads.
- `galerie` is an Uploadcare group (`cdnUrl` + `count`, files at `${cdnUrl}nth/{n}/`). Upload each file as an `Image` and store the new ids on `gallery`.
- Old `_User` rows become patstore `User` rows. `email` is copied to `username` and `email`. The old `username` is split on whitespace into `first_name` and `last_name`. Role ids: `fJLHcG227a` → `lVLJsMzfp6`, `BEsqnDlTYD` → `T3lnYiKGwF`, `tvBypX21DQ` → `1bTnmWLBXo`.
- `Zugriffe` become `User.access` entries `{ id, className, expires_at }`. `className` is the module connected class: `Verein` → `Club`, `Ergebnisse` and `Wettkampf` → `Championship`. `id` is the new objectId of that record. `Inhalte` has no class and is skipped.
- Every transferred class stores `former_id` so a second run can skip existing rows and remap links to the new ids.

## Suggested order

1. Season categories, then championship-type categories.
2. Locations from Hallen, then Clubs from Vereine.
3. Persons from Spieler, including `data`.
4. Articles, then Users.
5. Gallery images and championship downloads.
6. Championships. Build `data` from Spieltage, Meldungen, Gruppen, and Games. Put the new article id into `categories`.
7. Zugriffe onto `User.access`, using the new club and championship ids.

## Not migrated

- Spielplan slider (derived from games).
- Ergebnisse slider and `Wettkaempfe.ergebnisse`.
- Spieltag downloads.
- Autosave. The editor uses the page action bar and writes the championship in one update.
- Import slider behavior. The tab exists and is empty.
- Game generation calls `generateChampionshipGames` with `settings`, the selected match day, groups, and sign-ups. There is no model endpoint in this repo yet; the function builds a round-robin from that payload. Replace the function body when an AI provider is connected. The slide-in can stay.
