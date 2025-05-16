export async function fetcher(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data.');
      error.info = await response.json();
      error.status = response.status;
      return { error: error.message, status: error.status };
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return { error: error.message || 'An unexpected error occurred.', status: 500 };
  }
} 