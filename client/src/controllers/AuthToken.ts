export default async function AuthToken({ username }: { username: string }) {
    try {

        const localurl = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "localhost")
        const response = await fetch(localurl + "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({ username }), // Pass the actual data
        });

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            throw new Error("Failed to authenticate");
        }

        const json = await response.json();
        return json; // Return the parsed JSON from the response
    } catch (error) {
        console.error("postFetch error:", error);
        throw error;
    }
}
