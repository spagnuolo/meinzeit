<script>
    import { fade } from "svelte/transition";
    import { bullshit } from "./stores.js";
    let show_bullshit = false;

    const unsubscribe = bullshit.subscribe((value) => {
        show_bullshit = value;
    });
</script>

<div
    class="container"
    in:fade={{ delay: 350, duration: 1000 }}
    out:fade={{ duration: 200 }}
>
    <div class="column">
        <h2>Das Autonome Auto ist hier!</h2>
        <p>
            <span class={show_bullshit ? "bullshit" : ""}>
                Lang hat es nicht gedauert. Der Technikfortschritt zeigt wieder
                einmal seine rapide Geschwindigkeit.</span
            > Wie war aber der Verlauf der Entwicklung des Autonomen Autos? Im Jahr
            2004 veröffentlichen Frank Levy, ein MIT Professor und Richard J. Murnane,
            ein Havard Wirtschaftswissenschafts Professor, das Buch The New Division
            of Labor: How Computers Are Creating The Next Job Market. In diesem Buch
            argumentierten die zwei Autoren noch, dass Autofahrer*innen nicht durch
            Maschinen ersetzt werden könnten, da "es schwer vorstellbar sei die genauen
            Regeln zu entdecken, die das Verhalten eines Fahrer*innen reproduzieren."
            Jedoch nur einige Jahre später, im Jahre 2007, fand die DARPA Urban Challenge
            statt. Dieser Wettbewerb verlangte von den Teams Autonome Fahrzeuge zu
            entwickeln, die in der Lage sind im Verkehr zu fahren, an Kreuzungen
            Vorrang auszuhandeln, komplexe
        </p>
    </div>
    <div class="column">
        <p>
            Fahrmanöver auszuüben wie zum Beispiel einfädeln, parken und
            überholen. Sechs Teams mit ihren autonomen Fahrzeugen gewannen den
            Wettbewerb und bewiesen erstmalig der Welt, dass autonomes Fahren
            <span class={show_bullshit ? "bullshit" : ""}>
                eine Realität werden kann. Und dann haben die Konzerne das große
                Geld gerochen. Unternehmen wie VW, Uber, Tesla, Google, und
                Apple sind auf den Hypetrain aufgestiegen und haben in die
                Technologien investiert.</span
            >
        </p>
        <h2>Technische Umsetzung und künstliche Intelligenz</h2>
        <p>
            Autonom ist nicht gleich künstliche Intelligenz. Die ältere
            Generation der autonomen Fahrzeuge nutzte noch algorithmische
            Lösungsansätze. Das heißt das alle möglichen Handlungen und
            Entscheidungen vorher fest und manuell einprogrammiert werden
            mussten.
        </p>
    </div>
    <div class="column">
        <p>
            Um damals autonom zu Fahren arbeiteten Echtzeitsysteme zusammen, die
            für Lokalisierung, Umgebungswahrnehmung, Planung und Steuerung
            zuständig waren. Ein großes Problem war die Planung und
            Vorgehensweise bei Unklarheit. Eine Maschine mit algorithmischen
            Lösungsansätzen besitzt nur die einprogrammierte tiefe Domänenlogik.
            Sie kann nicht aus dieser Logik ausbrechen. Wir Menschen mit unserer
            Weltenlogik sind dort viel adaptiver auf Unklarheit vorbereitet. Dem
            entsprechend wird Künstliche Intelligenz eingesetzt, zum Beispiel
            für das Problem der Objekterkennung und Klassifizierung von Objekten
            und Personen. <span class={show_bullshit ? "bullshit" : ""}
                >In den letzten dutzend Jahren hat die Forschung durch jede
                Menge Testfahrten Daten gesammelt. Mit diesen Daten haben sie
                dann K.I. Modelle trainiert und verbessert, bis sie eine
                99.99999% Genauigkeit erreichte und so die
                Vollautomatiesierungspflicht eingeleitet hat.</span
            >
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
        font-size: 26px;
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
