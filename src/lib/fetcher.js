export async function fetcher(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.info = await response.json();
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(error.message || 'An unexpected error occurred.');
  }
} 