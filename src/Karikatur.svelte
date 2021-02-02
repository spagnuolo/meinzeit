<script>
    import { fade } from "svelte/transition";
    import { bullshit } from "./stores.js";
    let show_bullshit = false;

    const unsubscribe = bullshit.subscribe((value) => {
        show_bullshit = value;
    });
</script>

<div in:fade={{ delay: 350, duration: 1000 }} out:fade={{ duration: 200 }}>
    <div class="container">
        <div class="image">
            <img src="img/karikatur1.jpg" alt="karkatur1" />
        </div>
        <div class="image">
            <img src="img/karikatur2.jpg" alt="karkatur1" />
        </div>
    </div>
    <div class="center">
        <h1>Aufruf für unsere dritte Ausgabe im Jahr 2030</h1>
        <article style="width:800px">
            <span class={show_bullshit ? "bullshit" : ""}>
                Liebe Leser*innen,
                <br />
                <br />
                unsere nächste Ausgabe wird sich mit dem Thema ‘Urbanes Smart Living’
                beschäftigen und mit der Frage: „Sind Smart Homes die Möglichkeit
                ein langes Wohnen innerhalb der eigenen vier Wände zu ermöglichen?”.
                <br />
                <br />
                Ihre Meinung dazu ist gefragt. Wohnen Sie vielleicht selbst mit Smart
                Living und wenn ja, wie kommen Sie mit der Technologie zurecht? Gibt
                es Vor- und Nachteile? Haben Sie Verbesserungswünsche oder Kritik?
                Lassen Sie es uns wissen! Wie immer werden wir ihre Antworten lesen,
                sammeln, auf ihren Wunsch hin anonymisieren und in unserer nächsten
                Ausgabe, unter der Rubrik Leser*innenbriefe präsentieren.
                <br />
                <br />
                <br />
                Mit freundlichen Grüßen
                <br />
                <br />
                Ihre Redaktion
            </span>
        </article>
    </div>
</div>

<style>
    .container {
        display: flex;
        width: 100%;
        height: 100%;
    }

    .center {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .image {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    img {
        width: 95%;
        border-radius: 20px;
        border: solid;
    }
</style>
