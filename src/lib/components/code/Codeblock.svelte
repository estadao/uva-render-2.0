<script>
    export let value;
    const { conteúdo, linguagem } = value;

    function processContent(content) {
        return content.replace(/\\n/g, '\n').replace(/\\/g, '');
    }
</script>

<div class='P'>
    <code class={`language-${linguagem}`}>
        {#each conteúdo as block}
            {#if block.type === 'text'}
                <pre>{@html processContent(block.value)}</pre>
            {/if}
        {/each}
    </code>
</div>

<style>
    pre {
        color: var(--cor-primaria);
        font-size: 12px;
        cursor: text;
        margin: 3px 20px;
        overflow: auto;
    }

    div {
        background-color: var(--cor-placeholder);
        border-radius: 3px;
        margin: calc(var(--margem-vertical) * 1.5) auto;
        padding-top: 26px;
        padding-bottom: 26px;
    }
</style>