<script>
	import { UvaPath } from 'stores/store.js';
    import { version } from 'stores/version.js';
    import { onMount } from 'svelte';
    
    let UvaPages = "";
    UvaPath.subscribe(value => { UvaPages = value; });
    export let value;
    export let fonte = value;
</script>

<audio controls preload="none">
    <source 
        src="https://arte.estadao.com.br/public/pages/{UvaPages}{fonte}?v=${version()}" 
        type="audio/mp3">
</audio>

<style>
    audio {
        margin: calc(var(--margem-vertical) * 1) auto calc(var(--margem-vertical) * 1) auto;
        width: 100%;
    }
</style>