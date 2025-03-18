<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllBlogPosts, getStrapiMedia } from '../lib/strapi';
  
  // Fallback data in case API fails
  const fallbackPodcasts = [
    {
      Title: "Edge Computing Modernization",
      Summary: "Maciej comes from the old days like hardware ages. Remembers the definition of the cloud as a movement to another...",
      Cover: {
        url: "https://placehold.co/600x300/001133/0088ff?text=Edge+Computing+Modernization"
      },
      guests: ["Alexandra Becker", "Martin Schmidt", "Johannes Hiemer"],
      Slug: "edge-computing-modernization"
    },
    {
      Title: "Edge Computing & AI",
      Summary: "Everybody forgot about the Edge. But with our guest Michael Rode, EMEA VMware Channel Director at #dell Technologies, we discuss...",
      Cover: {
        url: "https://placehold.co/600x300/001133/0088ff?text=Edge+Computing+%26+AI"
      },
      guests: ["Michael Rode", "Martin Leitner"]
    },
    {
      Title: "IT security from very different angles",
      Summary: "In this episode, Maciej Leitusz talks about safety in the sense of leaving your comfort zone. That is the basis...",
      Cover: {
        url: "https://placehold.co/600x300/001133/0088ff?text=IT+Security"
      },
      guests: ["Ahmad Faruqui", "Martin Leitner"]
    }
  ];
  
  let podcasts = [];
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      // Fetch all blog posts
      const allPosts = await getAllBlogPosts(10);
      console.log("All posts fetched for podcasts:", allPosts);
      
      if (allPosts && allPosts.length > 0) {
        // Filter for podcast posts
        const podcastPosts = allPosts.filter(post => {
          const category = post.category;
          return category && category.Slug === 'podcast-post';
        });
        
        console.log("Podcast posts:", podcastPosts);
        
        if (podcastPosts.length > 0) {
          // Take the first 3 podcast posts
          podcasts = podcastPosts.slice(0, 3);
        } else {
          // Try to identify podcast-like posts by title or content
          const possiblePodcasts = allPosts.filter(post => {
            const title = post.Title || '';
            const summary = post.Summary || '';
            return title.toLowerCase().includes('podcast') || 
                   title.toLowerCase().includes('episode') ||
                   summary.toLowerCase().includes('podcast') ||
                   summary.toLowerCase().includes('episode');
          });
          
          if (possiblePodcasts.length > 0) {
            podcasts = possiblePodcasts.slice(0, 3);
            console.log("No podcast category posts found, using posts with podcast-related content");
          } else {
            // Use fallback data if no podcasts identified
            podcasts = fallbackPodcasts;
            console.warn("No podcast posts identified, using fallback data");
          }
        }
      } else {
        // Use fallback data if no posts returned
        podcasts = fallbackPodcasts;
        console.warn("No blog posts found from API, using fallback data for podcasts");
      }
    } catch (err) {
      console.error("Error loading podcasts:", err);
      podcasts = fallbackPodcasts;
    } finally {
      loading = false;
    }
  });
  
  // Helper functions to extract data from podcasts
  function getTitle(podcast) {
    if (podcast.Title) {
      return podcast.Title;
    }
    return podcast.title || 'Untitled Podcast';
  }
  
  function getExcerpt(podcast) {
    if (podcast.Summary) {
      return podcast.Summary;
    }
    return podcast.excerpt || podcast.summary || '';
  }
  
  function getImageUrl(podcast) {
    if (podcast.Cover) {
      return getStrapiMedia(podcast.Cover);
    }
    return podcast.image || 'https://placehold.co/600x300/001133/0088ff?text=No+Image';
  }
  
  function getGuests(podcast) {
    // For now, we'll extract guest names from the Link field or use dummy data
    // In a real implementation, you might have a dedicated guests field
    if (podcast.guests && Array.isArray(podcast.guests)) {
      return podcast.guests;
    }
    
    // Try to extract guest names from the author field
    if (podcast.author && podcast.author.Name) {
      return [podcast.author.Name];
    }
    
    return [];
  }
  
  // Helper function to get the podcast URL
  function getPodcastUrl(podcast) {
    if (podcast.Slug) {
      return `/podcast/${podcast.Slug}`;
    }
    return '#';
  }
</script>

<section id="podcasts" class="py-16 bg-white">
  <div class="container mx-auto px-6">
    <h2 class="text-3xl font-bold mb-12 text-center md:text-left text-gray-900">Podcasts</h2>
    
    {#if loading}
      <div class="text-center py-8">
        <p>Loading podcasts...</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each podcasts as podcast}
          <a href={getPodcastUrl(podcast)} class="block">
            <div class="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow h-full">
              <img 
                src={getImageUrl(podcast)} 
                alt={getTitle(podcast)} 
                class="w-full h-48 object-cover"
              />
              <div class="p-6">
                <h3 class="text-xl font-bold mb-3 text-gray-900">{getTitle(podcast)}</h3>
                <p class="text-gray-700 mb-4 line-clamp-3">{getExcerpt(podcast)}</p>
                
                {#if getGuests(podcast).length > 0}
                  <div class="mt-4">
                    <p class="text-sm text-gray-500 mb-1">Guests:</p>
                    <div class="flex flex-wrap gap-2">
                      {#each getGuests(podcast) as guest}
                        <span class="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                          {guest}
                        </span>
                      {/each}
                    </div>
                  </div>
                {/if}
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section> 