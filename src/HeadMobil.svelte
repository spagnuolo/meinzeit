<script>
    import { bullshit } from "./stores.js";
    let show_bullshit = false;

    const unsubscribe = bullshit.subscribe((value) => {
        show_bullshit = value;
    });
</script>

<div class="container">
    <div class="column">
        <h2>Rückblick auf das erste inklusive autonome Fahrzeug</h2>
        <p>
            In den letzten zehn Jahren hat sich sehr viel auf unseren Straßen
            geändert, doch wie fing das alles eigentlich an? Bereits im Jahr
            2017 wurde auf der Reha-Care das inklusive autonome Fahrzeug CLOUi
            vorgestellt. Die von der Firma Paravan dafür entwickelte Technologie
            dient bis heute als Grundbaustein der autonomen Mobilität. Besonders
            an diesem Fahrzeug, neben den zu diesem Zeitpunkt schon
            straßenzugelassenen Systemen, waren die unterschiedlichen
            Möglichkeiten zur Steuerung und auch zum Einstieg in das Fahrzeug.
            Durch einen Kassettenlift konnten auch Menschen mit Rollstuhl,
            Rollator, oder anderen Hilfsmitteln mühelos und selbstständig in das
            Fahrzeug einsteigen. Da damals aufgrund rechtlicher Unklarheiten
            Konzepte für das autonome Fahren Stufe 3-4, also mit einem*r
            Fahrer*in entwickelt wurden, konnten alternative Lenksysteme wie mit
            einem Joy-Stick, oder einer App eingebaut werden. Mit den
            Technologien von heute ist diese Funktion nicht mehr nötig.
        </p>
    </div>
    <div class="column">
        <h2>Entwicklung zur autonomen Mobilität - ein Risiko?</h2>
        <p>
            <span class={show_bullshit ? "bullshit" : ""}>
                Noch vor 10 Jahren wurden in der Politik, aber auch am
                Stammtisch oder in der Freundesgruppe ausgiebig über die vielen
                möglichen Probleme beim autonomen Fahren gesprochen. Damals
                waren viele Menschen skeptisch, ob das überhaupt funktionieren
                könne, so ganz ohne verantwortliche Person und vor allem ohne
                Lenkrad im Fahrzeug. Aus den letzten Jahren können wir
                schlussfolgern, wie bereichernd das autonome Fahren für einen
                großen Teil der Gesellschaft geworden ist. Auf dem
                Automobilmarkt herrscht weiterhin ein Wettkampf, es gibt keine
                Monopolfirmen. Für Menschen, die der Technologie anfangs
                skeptisch gegenüberstanden, bietet der Bund bis heute
                Fahrsicherheitstrainings an, um das Vertrauen in die Technik zu
                fördern. Kapitalschwache Personen werden durch den Staat
                finanziell unterstützt, und auch ländliche Regionen sind heute
                besser vernetzt als je zuvor. Durch diese Maßnahmen und die
                finanzielle Unterstützung des Bundes sind viele Menschen von der
                Nutzung autonomer Fahrzeuge begeistert.
            </span>
        </p>
    </div>
    <div class="column">
        <h2>Elektromobilität Heute</h2>
        <p>
            <span class={show_bullshit ? "bullshit" : ""}>
                Wie man schon vor Jahrzehnten festgestellt hat, waren
                CO2-Emissionen einer der großen Gefahren der Menschheit. Zum
                Glück konnten wir als Gesellschaft diese Gefahr abwenden. 2020
                waren die Werte noch bedrohlich hoch und haben uns vor viele
                Fragen gestellt. Nun aber im Jahr 2030 können wir zuversichtlich
                in die Zukunft schauen. Wir haben es geschafft. Die
                CO2-Emissionen bewegen sich heute in einem kontrollierten
                Rahmen, zumindest im Verkehrssektor. Die Elektromobilität sei
                Dank! Wir konnten mit Innovation und Wille die
                CO2-Emissionswerte gar um 75 % reduzieren und so das von 2020
                gesteckte Ziel um 33 beziehungsweise 35 Prozent übertreffen. Ein
                Riesenerfolg. Und schön zusehen, dass Politik, Wissenschaft und
                die Gesellschaft zusammen an einem Strang ziehen können. Selbst
                das zuletzt als größte Herausforderung geltende Problem der
                Energieerwirtschaftung, als auch das Speichern der dieser in
                Batterien konnte gelöst werden. Somit Fahren auf deutschen
                Straßen nur noch zu 100% elektrisch betriebene Fahrzeuge und ca.
                75% der Energie wird aus erneuerbaren Energiequellen bezogen.
                Und der Weg zu 100% Öko-Strom ist wohl auch nicht mehr weit,
                hört man aus Expertenkreisen.
            </span>
        </p>
    </div>
</div>

<style>
    .container {
        display: flex;
        width: 100%;
        /* justify-content: space-evenly; */
    }

    .column {
        height: 100%;
        display: flex;
        flex-direction: column;
        /* justify-content: center; */
        /* justify-items: flex-start; */
        /* align-content: flex-start; */
        /* align-content: center; */
    }

    /* h3, */
    h2 {
        margin: 0;
        margin-bottom: 16px;
        font-weight: 800;
        font-size: 24px;
        text-align: center;
    }

    /* h3 {
        text-align: left;
        font-size: 18px;
    } */

    div {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    p {
        text-align: justify;
        margin: auto;
        margin-bottom: 16px;
    }

    /* .block {
        text-align-last: justify;
    } */
</style>
