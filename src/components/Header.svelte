<script lang="ts">
  import { onMount } from 'svelte';
  import { getHeroContent, getNavItems, getStrapiMedia, getLogo } from '../lib/strapi';
  import { language } from '../lib/stores/language';
  import { t } from '../lib/i18n';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  
  let isOpen = false;
  let heroContent = null;
  let heroImageUrl = null;
  let debugInfo = '';
  let logoUrl = '';
  let navItems = [];
  
  function toggleMenu() {
    isOpen = !isOpen;
  }
  
  // Re-fetch content when language changes
  $: {
    if (typeof window !== 'undefined') {
      fetchHeroContent($language);
      fetchNavItems();
    }
  }
  
  async function fetchHeroContent(locale) {
    try {
      heroContent = await getHeroContent(locale);
      if (heroContent && heroContent.Hero_Img) {
        // Access the URL directly from the Hero_Img object
        const imageUrl = heroContent.Hero_Img.url;
        // Use getStrapiMedia to construct the full URL
        heroImageUrl = getStrapiMedia(imageUrl);
      } else {
        console.warn('No hero image found in content:', heroContent);
      }
    } catch (error) {
      console.error("Error in Header component:", error);
    }
  }

  async function fetchNavItems() {
    navItems = await getNavItems($language);
    console.log("Nav items:", navItems);
  }
  
  onMount(() => {
    fetchHeroContent($language);
    fetchNavItems();
  });

  onMount(async () => {
    const logo = await getLogo();
    if (logo) {
      logoUrl = logo;
    }
  });
</script>

<header class="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white shadow-md">
  <div class="container mx-auto px-6">
    <div class="flex justify-between items-center py-4">
      <a href="/" class="flex items-center">
        <img 
          src={logoUrl} 
          alt="TechCorp Logo" 
          class="h-8 transition-all duration-300"
        />
      </a>
      
      <div class="hidden lg:flex items-center space-x-8">
        {#each navItems as item}
          <div class="relative group">
            <a 
              href={item.slug} 
              class="text-gray-700 hover:font-bold transition-colors flex items-center"
            >
              {$t(item.title)}
          
            </a>
          </div>
        {/each}
        
        
        <LanguageSwitcher />
      </div>
      
      <div class="lg:hidden">
        <button 
          class="text-gray-700 hover:font-blue focus:outline-none"
          on:click={toggleMenu}
        >
          {#if isOpen}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          {:else}
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          {/if}
        </button>
      </div>
    </div>
  </div>
  
  {#if isOpen}
    <div class="lg:hidden bg-white border-t border-gray-100 shadow-lg w-full">
      <div class="container py-3">
        <ul class="space-y-3">
          {#each navItems as item}
            <li>
              <a 
                href={item.slug} 
                class="flex justify-between items-center py-2 text-gray-700 hover:text-blue-600"
                on:click={() => isOpen = false}
              >
                {$t(item.title)}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</header>

<!-- Hero image section with Strapi content -->
<div class="relative h-screen w-full overflow-hidden">
  {#if heroImageUrl}
    <img 
      src={heroImageUrl} 
      alt={heroContent?.Hero_Img?.alternativeText || "Hero image"} 
      class="absolute inset-0 w-full h-full object-cover"
      onError={(e) => { console.error("Image failed to load:", e); e.target.style.display = 'none'; }}
    />
  {:else}
    <!-- Fallback image if hero image fails to load -->
    <div class="absolute inset-0 bg-navy-900 flex items-center justify-center flex-col">
      <p class="text-white mb-4">Loading hero image...</p>
      {#if import.meta.env.DEV && debugInfo}
        <div class="bg-black bg-opacity-70 p-4 rounded max-w-2xl max-h-96 overflow-auto text-xs text-white">
          <pre>{debugInfo}</pre>
        </div>
      {/if}
    </div>
  {/if}

  <div class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="text-center px-6">
      <h1 class="text-white text-5xl md:text-7xl font-bold mb-6">
        {heroContent?.Title || "ENGINEERING IT"}
      </h1>
      {#if heroContent?.Description}
        <p class="text-white text-xl md:text-2xl max-w-3xl mx-auto">
          {heroContent.Description}
        </p>
      {/if}
    </div>
  </div>
</div>