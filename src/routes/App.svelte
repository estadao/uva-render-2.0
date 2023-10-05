<script>
    import { fetchDataAndSetContent, conteúdo } from 'stores/store.js';
    fetchDataAndSetContent();

    import 'css/global.css';
    import ImageContainer from "components/images/ImageContainer_responsive.svelte";
    import Rule from "components/rules/Rule.svelte"; 
    import Text from "components/texts/Text.svelte";
</script>

{#if $conteúdo.length > 0}
    {#each $conteúdo as block}
        {#if block.type === 'text'}
            <Text value={block.value} />
        {:else if block.type === 'imagem'}
            <ImageContainer value={block.value} />
        {:else if block.type === 'separador'}
            <Rule />
        {/if}
    {/each}
{:else}
    <p>Carregando...</p>
{/if}