export async function loadStates() {
  try {
    const response = await fetch("data/states.json");
    if (!response.ok)
      throw new Error(`State data request failed: ${response.status}`);
    const records = await response.json();
    if (!Array.isArray(records) || records.length < 15)
      throw new Error("The state dataset is missing or incomplete.");
    return records;
  } catch (error) {
    console.error("Unable to load state data:", error);
    throw error;
  }
}
