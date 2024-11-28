import { Interface } from './interface';

export default async function resetPassword({ email }: Interface) {
    try {

        const localurl = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "localhost")
        const response = await fetch(localurl + "/reset-password", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify({ email }), // Pass the actual data
        });

        // Check if the response is OK (status 200-299)
        if (!response.ok) {
            throw new Error("Failed to reset password");
        }

        const json = await response.json();
        return json; // Return the parsed JSON from the response
    } catch (error) {
        console.error("postFetch error:", error);
        throw error;
    }
}
