<script lang="ts">
  import { language, setLanguage } from '../lib/stores/language';
  
  export let showLabels = false;
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];
</script>

<div class="language-switcher">
  {#each languages as lang}
    <button 
      class="lang-button {$language === lang.code ? 'active' : ''}" 
      on:click={() => setLanguage(lang.code)}
      aria-label="Switch to {lang.name}"
    >
      <span class="uppercase">{lang.code}</span>
      {#if showLabels}
        <span class="lang-name">{lang.name}</span>
      {/if}
    </button>
  {/each}
</div>

<style>
  .language-switcher {
    display: flex;
    gap: 0.5rem;
  }
  
  .lang-button {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .lang-button:hover {
    background: rgba(0, 0, 0, 0.05);
  }
  
  .lang-button.active {
    border-color: #0066cc;
    background: rgba(0, 102, 204, 0.1);
  }
  
  .flag {
    font-size: 1.2rem;
  }
</style> 