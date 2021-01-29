<script>
	import { fade } from "svelte/transition";
	import Title from "./Title.svelte";
	import Head from "./Head.svelte";
	import Gallery from "./Gallery.svelte";
	import Interviews from "./Interviews.svelte";
	import Foot from "./Foot.svelte";
	import Plot from "./Plot.svelte";
	import Maria from "./Maria.svelte";
	import Konrad from "./Konrad.svelte";
	import Tail from "./Tail.svelte";
	import Eliza from "./Eliza.svelte";
	import Video from "./Video.svelte";
	import Side0 from "./Side0.svelte";
	import Side2 from "./Side2.svelte";
	import Side3 from "./Side3.svelte";
	import Side4 from "./Side4.svelte";

	let img_focus = 3;
	let fadeInTime = 300;
</script>

<div class="main">
	<div class="title">
		<Title />
	</div>

	<div class="head">
		<Head />
	</div>

	<div class="middle">
		<Gallery bind:focus={img_focus} />
	</div>

	<div class="foot">
		{#if img_focus == 1}
			<div class="player">
				<Video />
			</div>
		{:else if img_focus == 2}
			<div>
				<Plot />
			</div>
		{:else if img_focus == 3}
			<!-- <Maria /> -->
			<!-- <Konrad /> -->
			<!-- <img class="aufruf" src="img/aufruf.png" alt="aufruf" /> -->
			<div>
				<h2>Aufruf von letzer Woche:</h2>
				<article style="width:300px">
					Liebe Leser*innen,
					<br />
					<br />
					<div style="text-align:justify;">
						ihre Meinung ist wieder gefragt. Diesmal zu einem sehr
						aktuellem Thema: Das elektro-betriebene autonome
						Fahrzeug. Wie erleben Sie diese neue Technologie, die
						uns nun schon seit mehreren Wochen begleitet? Was hat
						sich für Sie beruflich oder privat verändert, seit der
						Vollautomatisierungspflicht? Besitzen Sie selbst ein
						autonomes Auto? Haben Sie dies-bezüglich Ängste oder
						Sorgen? Wir wollen wissen, was Sie beschäftigt!
					</div>
					<br />
					<br />
					Mit freundlichen
					<br />
					<br />
					Grüßen Ihre Redaktion
				</article>
			</div>
			<Interviews />
		{:else}
			<Foot />
		{/if}
	</div>

	<div class="side clouds">
		<audio controls>
			<source src="media/mikrowelle.mp3" type="audio/mpeg" />
			<track kind="captions" />
			Your browser does not support the audio tag.
		</audio>
		<!-- <div class="side {img_focus == null ? 'clouds' : ''}"> -->
		<!-- {#if img_focus == 0}
			<div in:fade={{ duration: fadeInTime }}>
				<Side0 />
			</div>
		{:else if img_focus == 1}
			<div in:fade={{ duration: fadeInTime }}>
				<Eliza />
			</div>
		{:else if img_focus == 2}
			<div in:fade={{ duration: fadeInTime }}>
				<Side2 />
			</div>
		{:else if img_focus == 3}
			<div in:fade={{ duration: fadeInTime }}>
				<Side3 />
			</div>
		{:else if img_focus == 4}
			<div in:fade={{ duration: fadeInTime }}>
				<Side4 />
			</div>
		{:else}
			<h2>{hmm}</h2>
		{/if} -->
	</div>

	<div class="tail">
		<Tail />
	</div>
</div>

<style>
	.title {
		/* background-color: #12341234; */
		grid-area: title;
	}

	.head {
		/* background-color: #22861744; */
		grid-area: head;
	}

	.middle {
		/* background-color: #632e1734; */
		grid-area: middle;
		height: 350px;
		margin: 10px 0 10px 0;
	}

	.side {
		/* background-color: #11798b49; */
		grid-area: side;
	}

	.foot {
		/* background-color: #86218f63; */
		grid-area: foot;
		height: 800px;

		display: flex;
		justify-content: space-around;
		overflow: hidden;
	}

	.tail {
		/* background-color: #ee4a4a63; */
		grid-area: tail;
		/* height: 200px; */
	}

	.main {
		display: grid;
		grid-template-columns: 25% 25% 25% 25%;
		grid-template-rows: auto;
		grid-template-areas:
			"title title title title"
			"head head head side"
			"middle middle middle side"
			"foot foot foot side"
			"tail tail tail tail";
	}

	.player {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin: 20px;
	}

	.clouds {
		height: 100%;
		background-color: #d9d9d9;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 56 28' width='56' height='28'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M56 26v2h-7.75c2.3-1.27 4.94-2 7.75-2zm-26 2a2 2 0 1 0-4 0h-4.09A25.98 25.98 0 0 0 0 16v-2c.67 0 1.34.02 2 .07V14a2 2 0 0 0-2-2v-2a4 4 0 0 1 3.98 3.6 28.09 28.09 0 0 1 2.8-3.86A8 8 0 0 0 0 6V4a9.99 9.99 0 0 1 8.17 4.23c.94-.95 1.96-1.83 3.03-2.63A13.98 13.98 0 0 0 0 0h7.75c2 1.1 3.73 2.63 5.1 4.45 1.12-.72 2.3-1.37 3.53-1.93A20.1 20.1 0 0 0 14.28 0h2.7c.45.56.88 1.14 1.29 1.74 1.3-.48 2.63-.87 4-1.15-.11-.2-.23-.4-.36-.59H26v.07a28.4 28.4 0 0 1 4 0V0h4.09l-.37.59c1.38.28 2.72.67 4.01 1.15.4-.6.84-1.18 1.3-1.74h2.69a20.1 20.1 0 0 0-2.1 2.52c1.23.56 2.41 1.2 3.54 1.93A16.08 16.08 0 0 1 48.25 0H56c-4.58 0-8.65 2.2-11.2 5.6 1.07.8 2.09 1.68 3.03 2.63A9.99 9.99 0 0 1 56 4v2a8 8 0 0 0-6.77 3.74c1.03 1.2 1.97 2.5 2.79 3.86A4 4 0 0 1 56 10v2a2 2 0 0 0-2 2.07 28.4 28.4 0 0 1 2-.07v2c-9.2 0-17.3 4.78-21.91 12H30zM7.75 28H0v-2c2.81 0 5.46.73 7.75 2zM56 20v2c-5.6 0-10.65 2.3-14.28 6h-2.7c4.04-4.89 10.15-8 16.98-8zm-39.03 8h-2.69C10.65 24.3 5.6 22 0 22v-2c6.83 0 12.94 3.11 16.97 8zm15.01-.4a28.09 28.09 0 0 1 2.8-3.86 8 8 0 0 0-13.55 0c1.03 1.2 1.97 2.5 2.79 3.86a4 4 0 0 1 7.96 0zm14.29-11.86c1.3-.48 2.63-.87 4-1.15a25.99 25.99 0 0 0-44.55 0c1.38.28 2.72.67 4.01 1.15a21.98 21.98 0 0 1 36.54 0zm-5.43 2.71c1.13-.72 2.3-1.37 3.54-1.93a19.98 19.98 0 0 0-32.76 0c1.23.56 2.41 1.2 3.54 1.93a15.98 15.98 0 0 1 25.68 0zm-4.67 3.78c.94-.95 1.96-1.83 3.03-2.63a13.98 13.98 0 0 0-22.4 0c1.07.8 2.09 1.68 3.03 2.63a9.99 9.99 0 0 1 16.34 0z'%3E%3C/path%3E%3C/svg%3E");
		border-radius: 5px;
	}

	audio {
		width: 100%;
	}

	/* .aufruf {
		height: 200px;
		margin-top: 150px;
	} */
</style>
