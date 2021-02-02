<script>
    import { bullshit } from "./stores.js";
    let show = false;
</script>

<hr />
<div class="container">
    <div>
        show bullshit
        <input
            type="checkbox"
            bind:checked={show}
            on:change={bullshit.set(show)}
        />
    </div>
    <div class="spacer" />
    <div>
        <a href="./impressum.html">Impressum</a>
    </div>
</div>

<style>
    .container {
        width: 100%;
        display: flex;
        justify-content: space-around;
    }

    a,
    a:hover,
    a:active {
        color: rgb(37, 35, 35);
    }
</style>
