<script>
    import Eliza from "elizabot";
    import { beforeUpdate, afterUpdate } from "svelte";

    let div;
    let autoscroll;

    beforeUpdate(() => {
        autoscroll =
            div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
    });

    afterUpdate(() => {
        if (autoscroll) div.scrollTo(0, div.scrollHeight);
    });

    const eliza = new Eliza();

    let comments = [{ author: "eliza", text: eliza.getInitial() }];

    function handleKeydown(event) {
        if (event.key === "Enter") {
            const text = event.target.value;
            if (!text) return;

            comments = comments.concat({
                author: "user",
                text,
            });

            event.target.value = "";

            const reply = eliza.transform(text);

            setTimeout(() => {
                comments = comments.concat({
                    author: "eliza",
                    text: "...",
                    placeholder: true,
                });

                setTimeout(() => {
                    comments = comments
                        .filter((comment) => !comment.placeholder)
                        .concat({
                            author: "eliza",
                            text: reply,
                        });
                }, 500 + Math.random() * 500);
            }, 200 + Math.random() * 200);
        }
    }
</script>

<style>
    .chat {
        display: flex;
        flex-direction: column;
        height: 800px;
        max-width: 320px;
        overflow: hidden;
    }

    .scrollable {
        flex: 1 1 auto;
        /* border-top: 1px solid #eee; */
        margin: 0 0 0.5em 0;

        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding-left: 10px;
        padding-right: 17px;
        box-sizing: content-box;
    }

    article {
        margin: 0.5em 0;
    }

    .user {
        text-align: right;
    }

    span {
        padding: 0.5em 1em;
        display: inline-block;
    }

    .eliza span {
        /* background-color: #eee; */
        background-color: white;
        border-radius: 1em 1em 1em 0;
    }

    .user span {
        background-color: #0074d9;
        color: white;
        border-radius: 1em 1em 0 1em;
    }
</style>

<div class="chat">
    <h1>Konversation</h1>

    <div class="scrollable" bind:this={div}>
        {#each comments as comment}
            <article class={comment.author}>
                <span>{comment.text}</span>
            </article>
        {/each}
    </div>

    <input on:keydown={handleKeydown} />
</div>
