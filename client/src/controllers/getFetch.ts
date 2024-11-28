export default async function getFetch() {
    const localurl = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : "localhost")
    const fetched = await fetch(localurl + "/accounts");
    const data = await fetched.json();
    return data;
}
