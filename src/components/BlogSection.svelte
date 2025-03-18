<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllBlogPosts, getStrapiMedia } from '../lib/strapi';
  
  // Fallback data in case API fails
  const fallbackPosts = [
    {
      Title: "Mastering Apache Kafka Monitoring: Key Metrics and Tools for Reliable Performance",
      Summary: "Imagine a critical e-commerce platform that relies on Apache Kafka to process orders, track inventory, and manage real-time notifications...",
      Cover: {
        url: "https://placehold.co/600x300/001133/0088ff?text=Apache+Kafka+Monitoring"
      },
      author: {
        Name: "Felix Schneider"
      },
      PublishedDate: "2025-01-24T12:00:00.000Z",
      Slug: "mastering-apache-kafka-monitoring"
    },
    {
      Title: "evoila Achieves Fortinet \"SD-WAN\" and \"Secure Connectivity LAN\" Specializations",
      Summary: "We are pleased to announce that we have acquired two new Fortinet specializations: \"SD-WAN\" and \"Secure Connectivity LAN\". As a...",
      Cover: {
        url: "https://placehold.co/600x300/001133/0088ff?text=Fortinet+Specializations"
      },
      author: {
        Name: "Simon Köhler"
      },
      PublishedDate: "2024-12-18T12:00:00.000Z",
      Slug: "evoila-achieves-fortinet-sd-wan-and-secure-connectivity-lan-specializations"
    },
    {
      Title: "evoila Wishes You a Merry Christmas 2024 and a Happy New Year 2025",
      Summary: "A moment of gratitude and a small gesture with a big impact Surrounded by the hustle and bustle of the...",
      Cover: {
        url: "https://placehold.co/600x300/001133/0088ff?text=Merry+Christmas"
      },
      author: {
        Name: "Team evoila"
      },
      PublishedDate: "2024-12-17T12:00:00.000Z",
      Slug: "evoila-wishes-you-a-merry-christmas-2024-and-a-happy-new-year-2025"
    }
  ];
  
  let blogPosts = [];
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      // Fetch all blog posts
      const allPosts = await getAllBlogPosts(10);
      console.log("All posts fetched:", allPosts);
      
      if (allPosts && allPosts.length > 0) {
        // Filter out podcast posts
        const standardPosts = allPosts.filter(post => {
          const category = post.category;
          return !category || category.Slug !== 'podcast-post';
        });
        
        console.log("Standard posts:", standardPosts);
        
        if (standardPosts.length > 0) {
          // Take the first 3 standard posts
          blogPosts = standardPosts.slice(0, 3);
        } else {
          // Use fallback data if no standard posts found
          blogPosts = fallbackPosts;
          console.warn("No standard posts found, using fallback data");
        }
      } else {
        // Use fallback data if no posts returned
        blogPosts = fallbackPosts;
        console.warn("No blog posts found from API, using fallback data");
      }
    } catch (err) {
      console.error("Error loading blog posts:", err);
      blogPosts = fallbackPosts;
    } finally {
      loading = false;
    }
  });
  
  // Helper functions to extract data from posts
  function getTitle(post) {
    if (post.Title) {
      return post.Title;
    }
    return post.title || 'Untitled Post';
  }
  
  function getExcerpt(post) {
    if (post.Summary) {
      return post.Summary;
    }
    return post.excerpt || post.summary || '';
  }
  
  function getImageUrl(post) {
    if (post.Cover) {
      return getStrapiMedia(post.Cover);
    }
    return post.image || 'https://placehold.co/600x300/001133/0088ff?text=No+Image';
  }
  
  function getAuthor(post) {
    if (post.author && post.author.Name) {
      return post.author.Name;
    }
    return post.author || 'Unknown Author';
  }
  
  function getDate(post) {
    if (post.PublishedDate) {
      const dateStr = post.PublishedDate;
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      } catch (e) {
        console.error("Error parsing date:", e);
        return dateStr;
      }
    }
    if (post.date) {
      return post.date;
    }
    return 'Unknown date';
  }
  
  // Helper function to get the post URL
  function getPostUrl(post) {
    if (post.Slug) {
      return `/blog/${post.Slug}`;
    }
    return '#';
  }
</script>

<section class="py-16 bg-gray-50">
  <div class="container mx-auto px-6">
    <h2 class="text-3xl font-bold mb-12 text-center md:text-left text-gray-900">News from the Blog</h2>
    
    {#if loading}
      <div class="text-center py-8">
        <p>Loading blog posts...</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each blogPosts as post}
          <a href={getPostUrl(post)} class="block">
            <div class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full">
              <img 
                src={getImageUrl(post)} 
                alt={getTitle(post)} 
                class="w-full h-48 object-cover"
              />
              <div class="p-6">
                <h3 class="text-xl font-bold mb-3 text-gray-900 line-clamp-2">{getTitle(post)}</h3>
                <p class="text-gray-700 mb-4 line-clamp-3">{getExcerpt(post)}</p>
                <div class="flex items-center text-gray-500 text-sm">
                  <span class="font-medium">{getAuthor(post)}</span>
                  <span class="mx-2">•</span>
                  <span>{getDate(post)}</span>
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {/if}
  </div>
</section> 