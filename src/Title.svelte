<script>
    import { fade } from "svelte/transition";
    let endung1 = "";
    let endung2 = "";
    let seperator = "";
    let visible = true;
    let fadingTime = 1100;

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function typewriter(speed = 200) {
        seperator = " ";

        const text = "ung";

        for (let i = 0; i <= text.length; i++) {
            await sleep(speed);
            endung1 = text.slice(0, i);
        }

        for (let i = 0; i <= text.length; i++) {
            await sleep(speed);
            endung2 = text.slice(0, i);
        }

        await sleep(1500);
        visible = !visible;
        await sleep(fadingTime - 50);
        visible = !visible;
        seperator = "";
        endung1 = "";
        endung2 = "";
    }

    typewriter();
    window.setInterval(() => {
        typewriter();
    }, 20000);
</script>

{#if visible}
    <h1 transition:fade={{ duration: fadingTime }}>
        mein<span class="ending">{endung1}</span>{seperator}zeit<span
            class="ending">{endung2}</span
        >
    </h1>
    <!-- {:else}
    <h1 in:fade={{ delay: 1200, duration: 1300 }} out:fade={{ duration: 1300 }}>
        mein<span class="ending">{endung1}</span>{seperator}zeit<span
            class="ending">{endung2}</span
        >
    </h1> -->
{/if}
<h2>Meine Meinung, deine Meinung – unsere Zeitung</h2>
<div><span>Ausgabe 2030/2</span> <span class="preis">1,30¥</span></div>
<hr />

<style>
    h1 {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 60px;
        text-align: center;
        text-transform: uppercase;
        margin: 16px 0 0 0;
    }

    h2 {
        font-family: Georgia, "Times New Roman", Times, serif;
        font-size: 22px;
        font-weight: 500;
        text-align: center;
        margin: 16px 0 0 0;
    }

    div {
        width: 94%;
        color: rgb(114, 114, 114);
        font-size: 20px;
        font-weight: 600;
        margin: 0;
        padding: 0 32px;
    }

    .preis {
        float: right;
        margin-right: 10px;
    }

    .ending {
        color: #898989;
    }
</style>
