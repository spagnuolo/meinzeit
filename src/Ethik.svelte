<script>
    import { fade } from "svelte/transition";
    import { bullshit } from "./stores.js";
    let show_bullshit = false;

    const unsubscribe = bullshit.subscribe((value) => {
        show_bullshit = value;
    });
</script>

<div in:fade={{ delay: 350, duration: 1000 }} out:fade={{ duration: 200 }}>
    <h2>Zur Ethik autonomen Fahrens</h2>
    <p>
        Im Juni 2017 veröffentliche das Bundesministerium für Verkehr und
        digitale Infrastruktur einen Bericht der Ethik-Kommission. Dieser
        Bericht analysierte Chancen und Risiken des automatisierten und
        vernetzten Fahrens für die Gegenwart und die Zukunft. Des Weiteren
        wurden zwanzig „Ethische Regeln für den vernetzten und automatisierten
        Fahrzeugverkehr“ aufgestellt, die an dieser Stelle erwähnt, jedoch nicht
        im Detail erläutert werden können. Bis heute im Jahr 2030 blieben eine
        Reihe der damals diskutierten Fragen für die Ethik-Kommission im
        abschließenden Bericht unbeantwortet. Eine dieser offenen Fragen zum
        autonomen Fahren bezieht sich auf das sogenannte overruling durch den
        Menschen. Wenn das autonome Fahren als die sicherste Möglichkeit der
        Fortbewegung angesehen wird, wie sieht es dann mit der Möglichkeit aus,
        das Steuer als menschliche*r Fahrer*in selbst wieder zu übernehmen? Dies
        könne als ein Sicherheitsrisiko eingestuft werden, welches durch eine
        Verhinderung von overruling vermieden werden könne. Andererseits müsse
        in einer demokratischen Gesellschaft auch eine Entscheidungsfreiheit
        gewährleistet sein . Die Ethik-Kommission verwies in dieser Frage
        darauf, dass es keine ethische Regel gebe, die die Sicherheit der
        Straßenverkehrsteilnehmer*innen über das persönliche Freiheitsempfinden
        stelle. Daran schloss eine andere offene Frage an, die sich der Technik
        unter geteilten Verantwortungszuständigkeiten widmete Für gewöhnliche
        läge die Verantwortung bei Hersteller*in und Betreiber*in. Bei einer
        geteilten Verantwortung müsse klar darin unterschieden werden, wer wann
        das Fahrzeug führe und damit die Verantwortung trägt. Wenn die
        Möglichkeit bestände, das Fahrzeug in Notsituationen wieder manuell zu
        steuern, zum Beispiel wenn das technische System die Sicherheit nicht
        mehr gewährleisten kann, so müsse gewährleistet werden, dass die Abgabe
        rechtzeitig geschieht und nicht akut. Oder das Fahrzeug müsse
        selbstständig sicher vor der Übergabe an den Straßenrand fahren. Wenn
        die Kontrolle in einer Notsituation nicht mehr abgegeben sei, dann müsse
        das Auto von seiner Technik in einen sicheren Zustand versetzt werden,
        der bestmögliche Sicherheit für alle Verkehrsteilnehmer*innen gewähre.
        Das fünfte Themenfeld bezog sich auf eine gesetzliche Pflicht zur
        Vollautomatisierung der Verkehrssysteme.
        <span class={show_bullshit ? "bullshit" : ""}>
            Wie unsere lieben Leser*innen wissen, wurde in den letzten Jahren
            von der Bundesregierung eine von der Industrie viel gelobte, aber
            von anderen stark kritisierte, Vollautomatisierungspflicht für
            Fahrzeuge eingeführt.</span
        >
        Durch eine Beschränkung auf die Nutzung von autonomfahrenden Fahrzeugen sollen
        von Menschen verursachte Fahrzeugunfälle im Straßenverkehr vermieden werden.
        <span class={show_bullshit ? "bullshit" : ""}
            >Umso aktueller sind im Jahr 2030 daher die Überlegungen der
            Ethik-Kommission von 2017 über die Folgen einer solchen
            Vollautomatisierungspflicht:</span
        >
        Laut der damaligen Ethik-Kommission basiere autonomes Fahren der Stufe 5
        auf der Annahme einer Überlegenheit der Technik gegenüber menschlichen Entscheidungen
        und ihrer Fehlbarkeit. Jedoch, so merkte die Ethik-Kommission an, bestehe
        in einer Demokratie für alle Menschen Handlungsfreiheit. Dies beziehe sich
        auch auf die bewusste Entscheidung eines Menschen, welche technischen Möglichkeiten
        genutzt werden sollen und welche nicht. Die Ethik-Kommission gab weiterhin
        zu bedenken: „Eine verpflichtende Einführung solcher Systeme würde den Menschen
        im Rahmen seiner Entfaltungsmöglichkeiten […] stark einschränken“. Daher
        könne die verpflichtende Nutzung autonomer Systeme nicht über eine höhere
        Sicherheit vollautomatisierter Systeme begründet werden.
        <span class={show_bullshit ? "bullshit" : ""}
            >Dies wirft im Jahr 2030 die Frage auf, ob wir mit der
            Vollautomatisierungspflicht unter Umständen unsere persönliche
            Freiheit für einen inkludierenden technischen Fortschritt geopfert
            haben? Ist dies dann noch inklusiv?</span
        >
        Im Jahr 2017 warnte die Ethik-Kommission auch vor den Folgen autonomen Fahrens.
        Denn, wird autonomes Fahren als Teil einer Entwicklung betrachtet, in der
        die menschliche Arbeitskraft durch Roboter ersetzt wird, so ist diese technische
        Entwicklung irreversible: Ohne Fahrschulausbildung fehlt den Menschen der
        Erwerb von ständig-zu-trainierenden Kenntnissen im Autofahren.
        <span class={show_bullshit ? "bullshit" : ""}
            >Eine Entwicklung, die wir heutzutage beobachten können, liebe
            Leser*innen!</span
        > In Bezug auf die obige Frage der persönlichen Entscheidungsfreiheit, verhindere
        das Fehlen eines selbstständigen Erlernens des Auto- oder auch Fahrradfahrens
        auch weitere selbstbestimmte Handlungen der Fahrzeuginsassen. Ohne Führerscheinausbildung
        ist eine sichere Fahrzeugsteuerung im Notfall für die meisten Menschen nicht
        mehr möglich.
    </p>
</div>

<style>
    div {
        margin: 0;
        margin-left: 16px;
        margin-right: 16px;
    }

    h2 {
        font-size: 24px;
        font-weight: 800;
        text-align: center;
        margin: 0;
    }

    p {
        text-align: justify;
        text-align-last: justify;
        margin: 0;
        margin-bottom: 16px;
    }
</style>
