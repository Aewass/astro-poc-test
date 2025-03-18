<script lang="ts">

  import { onMount } from 'svelte';
  import { getConsultationContent, getStrapiMedia } from '../lib/strapi'
  import { language } from '../lib/stores/language';

  interface ConsultationContent {
    Title?: string;
    Description?: string;
    BulletPoints?: string;
    ButtonText?: string;
    Image?: {
      url: string;
      alternativeText?: string;
    };
    [key: string]: any; // For any other properties
  }

  let consultationContent: ConsultationContent | null = null;
  let consultationImageUrl: string | null = null;

  onMount(async () => {    
    try {
      consultationContent = await getConsultationContent($language);
      if (consultationContent && consultationContent.Image) {
        consultationImageUrl = getStrapiMedia(consultationContent.Image.url);
      } else {
        console.warn("No Image found in consultation content");
      }
    } catch (error) {
      console.error('Error in ConsultationSection:', error);
    }
  });

  $: {
    if ($language) {
      getConsultationContent($language).then(content => {
        consultationContent = content;
        if (content && content.Image) {
          consultationImageUrl = getStrapiMedia(content.Image.url);
        } else {
          console.warn("No Image found in consultation content");
        }
      }).catch(error => {
        console.error('Error in ConsultationSection:', error);
      });
    }
  }

</script>

<section class="py-24 bg-white w-full">
  <div class="container mx-auto px-6">
    <div class="flex flex-col md:flex-row md:gap-24 items-center">
      <div class="md:w-1/2 w-full mb-12 md:mb-0">
        {#if consultationImageUrl}
          <img 
            src={consultationImageUrl} 
            alt="Consultation illustration" 
            class="w-full rounded-3xl"
          />
        {:else}
          <!-- Placeholder image -->
          <img 
            src="https://placehold.co/600x600/e6f0ff/0066CC?text=Brain+Illustration" 
            alt="Brain with computer connections illustration" 
            class="w-full rounded-3xl"
          />
        {/if}
      </div>
      
      <div class="md:w-1/2 w-full">
        <h2 class="text-4xl font-bold mb-6 text-gray-900">
          {consultationContent?.Title || "Individuality, service, and performance"}
        </h2>
        <p class="text-lg text-gray-700 mb-6">
          {consultationContent?.Description || "We develop ground-breaking IT strategies and solutions. Enter the solution boutique: current technology, individuality, and personal consulting."}
        </p>
        
        {#if consultationContent?.BulletPoints}
          <ul class="space-y-5 mb-10">
            {#each consultationContent.BulletPoints.split('\n') as point}
              <li class="flex items-start gap-4">
                <div class="bg-gray-100 rounded-full p-1 flex-shrink-0 mt-1">
                  <svg 
                    class="w-5 h-5 text-gray-700" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span class="text-gray-700 text-lg">{point}</span>
              </li>
            {/each}
          </ul>
        {/if}
        
        <a href="/contact" class="inline-flex items-center bg-primary-800 text-white px-8 py-3 rounded-md hover:bg-primary-900 transition-colors text-lg">
          {consultationContent?.ButtonText || "Get started with us!"}
          <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  </div>
</section> 