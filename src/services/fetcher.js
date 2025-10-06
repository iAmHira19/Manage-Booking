export const fetcher = async (url, option = {}) => {
  try {
    let resp = await fetch(url, {
      ...option,
    });
    if (!resp.ok) {
      const errDetails = await resp.json();
      throw new Error(errDetails.message || "Something went wrong");
    }
    return await resp.json();
  } catch (error) {
    throw error;
  }
};
