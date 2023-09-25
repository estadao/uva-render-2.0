<script>
    import { fetchDataAndSetContent, conteúdo } from 'stores/store.js';
    fetchDataAndSetContent();

    import 'css/global.css';
    import Text from "components/texts/Text.svelte";
</script>

{#if $conteúdo.length > 0}
    {#each $conteúdo as block}
        {#if block.type === 'text'}
            <Text value={block.value} />
        {/if}
    {/each}

{:else}
    <p>Carregando...</p>
{/if}