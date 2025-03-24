const STRAPI_URL =
  import.meta.env.PUBLIC_STRAPI_DOMAIN || "http://localhost:1337";
const STRAPI_TOKEN = import.meta.env.PUBLIC_STRAPI_API_TOKEN;

export async function fetchAPI(endpoint: string, locale = "en") {
  const url = `${STRAPI_URL}/api/${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }locale=${locale}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching from Strapi: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    return null;
  }
}

export async function getHeroContent(locale = "en") {
  try {
    const response = await fetchAPI(`heroes?populate=*`, locale);

    // Based on the console output, the data is directly in the response.data array
    if (
      response?.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      // The first item in the array is the hero content
      return response.data[0];
    }
    console.warn("No hero content found in Strapi response");
    return null;
  } catch (error) {
    console.error("Error fetching hero content:", error);
    return null;
  }
}

export async function getConsultationContent(locale = "en") {
  try {
    const data = await fetchAPI("consultations?populate=*", locale);
    // Extract the data from the response
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching consultation content:", error);
    return null;
  }
}

export async function getServicesContent(locale = "en") {
  try {
    const data = await fetchAPI("services?populate=*", locale);
    console.log("API response:", data);
    // Extract the data from the response
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      // Log the extracted content for debugging
      console.log("Extracted content:", data.data[0]);
      return data.data[0];
    }

    return null;
  } catch (error) {
    console.error("Error fetching services content:", error);
    return null;
  }
}

export function getStrapiMedia(media) {
  if (!media) return null;

  // If media is a string, use it directly
  if (typeof media === "string") {
    // If it's already an absolute URL
    if (media.startsWith("http")) {
      return media;
    }
    // Otherwise, prepend the Strapi URL
    const strapiUrl =
      import.meta.env.PUBLIC_STRAPI_URL || "http://localhost:1337";
    return `${strapiUrl}${media}`;
  }

  // If media is an object with a url property
  if (media.url) {
    // If the URL is already absolute
    if (media.url.startsWith("http")) {
      return media.url;
    }
    // Otherwise, prepend the Strapi URL
    const strapiUrl =
      import.meta.env.PUBLIC_STRAPI_URL || "http://localhost:1337";
    return `${strapiUrl}${media.url}`;
  }

  return null;
}

/**
 * Fetches blog posts from Strapi with optional category filter
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of posts to return
 * @param {string} options.categorySlug - Filter by category slug
 * @returns {Promise<Array>} - Blog posts array
 */
export async function getBlogPosts(options = {}, locale = "en") {
  const { limit = 3, categorySlug = null } =
    typeof options === "number"
      ? { limit: options } // Handle legacy calls with just a number
      : options;

  // Build the URL with proper filters
  let url = `blog-posts?pagination[limit]=${limit}&sort=publishedAt:desc&populate=*${
    options.categorySlug
      ? `&filters[category][slug]=${options.categorySlug}`
      : ""
  }`;

  // Add category filter if provided
  if (categorySlug) {
    // Try a different filter approach - this is more compatible with Strapi v4
    url = `blog-posts?filters[category][slug]=${categorySlug}&pagination[limit]=${limit}&sort=publishedAt:desc&populate=*`;
  }

  try {
    console.log(`Fetching from URL: ${url}`);
    const response = await fetchAPI(url, locale);
    console.log(
      `Full API response for ${categorySlug || "all posts"}:`,
      response
    );

    // Check if we have a valid response structure
    if (response && response.data) {
      return response.data;
    } else {
      console.error(
        `Invalid response structure for ${categorySlug || "all posts"}:`,
        response
      );
      return [];
    }
  } catch (error) {
    console.error(
      `Error fetching blog posts (category: ${categorySlug || "all"}):`,
      error
    );
    return [];
  }
}

/**
 * Fetches all blog posts from Strapi
 * @param {number} limit - Maximum number of posts to return
 * @returns {Promise<Array>} - Blog posts array
 */
export async function getAllBlogPosts(limit = 10, locale = "en") {
  try {
    const url = `blog-posts?pagination[limit]=${limit}&sort=publishedAt:desc&populate=*`;
    console.log(`Fetching all posts from URL: ${url}`);
    const response = await fetchAPI(url, locale);
    console.log("All blog posts response:", response);

    if (response && response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching all blog posts:", error);
    return [];
  }
}

/**
 * Filters blog posts by category
 * @param {Array} posts - All blog posts
 * @param {string} categorySlug - Category slug to filter by
 * @returns {Array} - Filtered blog posts
 */
export function filterPostsByCategory(posts, categorySlug) {
  if (!posts || !Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  return posts.filter((post) => {
    // Check if post has a category and if it matches the requested slug
    const category = post.category;
    return category && category.Slug === categorySlug;
  });
}

/**
 * Gets standard blog posts (client-side filtering)
 * @param {Array} allPosts - All blog posts
 * @returns {Array} - Standard blog posts
 */
export function getStandardPosts(allPosts) {
  return filterPostsByCategory(allPosts, "standard-post");
}

/**
 * Gets podcast posts (client-side filtering)
 * @param {Array} allPosts - All blog posts
 * @returns {Array} - Podcast posts
 */
export function getPodcastPosts(allPosts) {
  return filterPostsByCategory(allPosts, "podcast-post");
}

export async function getTranslations(locale = "en") {
  try {
    const data = await fetchAPI("i18n/localizations", locale);
    return data;
  } catch (error) {
    console.error("Error fetching translations:", error);
    return {};
  }
}

export async function getLogo() {
  try {
    const response = await fetchAPI("logo?populate=*");
    if (response?.data?.logo?.url) {
      const logoUrl = response.data.logo.url;
      return getStrapiMedia(logoUrl);
    }

    console.warn("No logo found in Strapi response");
    return null;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
}

export async function getNavItems(locale = "en") {
  try {
    const response = await fetchAPI("navbar-items?populate=*", locale);
    console.log("Nav items response:", response);
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching navigation items:", error);
    return [];
  }
}
