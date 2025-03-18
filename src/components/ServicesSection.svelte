<script lang="ts">
  import { onMount } from 'svelte';
  import { getServicesContent } from '../lib/strapi';
  import { language } from '../lib/stores/language';
  interface ServiceCard {
    id: number;
    Title: string;
    Description: string;
    Link: string;
    iconUrl?: string;
    [key: string]: any; // For any other properties
  }
  
  interface ServicesContent {
    id?: number;
    Title?: string;
    Description?: string;
    Service_Card?: ServiceCard[];
    [key: string]: any; // For any other properties
  }
  
  let servicesContent: ServicesContent | null = null;
  let loading = true;
  let error: string | null = null;
  
  onMount(async () => {
    try {
      const data = await getServicesContent($language);
      if (!data) {
        throw new Error('Failed to fetch services data');
      }
      
      servicesContent = {
        id: data.id,
        Title: data.Title,
        Description: data.Description,
        Service_Card: data.Service_Card || []
      };
      
    } catch (err) {
      console.error('Error fetching services:', err);
      error = err.message;
    } finally {
      loading = false;
    }
  });


  // Re-fetch content when language changes
  $: {
    if ($language) {
      getServicesContent($language).then(data => {
        servicesContent = data;
      });
    }
  }
</script>

<style>
  .dots {
    animation: blink 1s infinite;
    opacity: 1;
  }
  
  @keyframes blink {
    50% { opacity: 0; }
  }

  @keyframes ellipsis {
    0% { content: '.'; }
    33% { content: '..'; }
    66% { content: '...'; }
    100% { content: '.'; }
  }
</style>

<section class="py-16 bg-primary-50">
  <div class="container mx-auto px-6">
    {#if loading}
      <div class="text-center py-12">
        <div class="inline-flex items-center text-lg text-gray-700">
          Loading services
          <span class="ml-1 animate-pulse">...</span>
        </div>
      </div>
    {:else if error}
      <div class="text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    {:else}
      <div class="text-center md:text-left max-w-4xl mx-auto md:mx-0 mb-12">
        <h2 class="text-3xl font-bold mb-4 text-gray-900">{servicesContent?.Title || "Our Services"}</h2>
        <p class="text-gray-700">{servicesContent?.Description || "We offer a range of services to meet your needs."}</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each servicesContent?.Service_Card || [] as service}
          <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div class="flex flex-col h-full">
              <div class="mb-6 flex justify-center">
                <div class="bg-primary-800 w-16 h-16 rounded-full flex items-center justify-center">
                </div>
              </div>
              <h3 class="text-xl font-semibold mb-3 text-center">{service.Title}</h3>
              <p class="text-gray-700 mb-6 flex-grow text-center line-clamp-3">{service.Description}</p>
              <div class="text-center">
                <a href={service.Link} class="text-primary-800 hover:underline inline-flex items-center">
                  {service.Title}
                  <svg class="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</section> 