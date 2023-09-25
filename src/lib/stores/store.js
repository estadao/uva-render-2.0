// @ts-nocheck
import { writable } from 'svelte/store';
import { version } from 'stores/version.js';
import { onMount } from 'svelte';

export const UvaPath = writable('');
export const conteúdo = writable([]);
export const functionExecuted = writable(false);

// ************ //
// 1. Converts the UvaPages ID to the UvaPages path
// ************ //
function IDReportagemUvaPages1(id) {
    return id.replace(/.{2}/g, `$&/`);
}
function IDReportagemUvaPages2(id) {
    return id;
}

// ************ //
// 2. Gets the UvaPages ID from the script tag
// ************ //
if (typeof document !== 'undefined') {
    const uvaScript = document.querySelectorAll(`[data-uva-id]`);
    if (uvaScript.length > 0) {
        const id = uvaScript[0].getAttribute(`data-uva-id`);
        let path = '';
        if (id.length === 12) {
            path = IDReportagemUvaPages1(id);
        } else {
            path = IDReportagemUvaPages2(id) + '/';
        }
        UvaPath.set(path);
    }
}

// ************ //
// 3. Defines the URL to fetch the JSON from the UvaPages API
// ************ //
export function buildJsonUrl(UvaPages) {
    return `https://arte.estadao.com.br/public/pages/${UvaPages}page.json?v=${version}`;
}

// ************ //
// 4. Fetches the JSON from the UvaPages API and sets the content
// ************ //
export async function fetchDataAndSetContent() {
    let UvaPages;

    UvaPath.subscribe(value => {
        UvaPages = value;
        const json = buildJsonUrl(UvaPages);

        onMount(async function () {
            const response = await fetch(json);
            const data = await response.json();
            if (data && data.conteúdo) {
                conteúdo.set(Object.values(data.conteúdo));
                functionExecuted.set(true);
                console.log(data);
            } else {
                console.error('Conteúdo não encontrado na resposta JSON.');
            }
        });
    });
}