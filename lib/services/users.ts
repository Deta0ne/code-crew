'use server';
export type User = {
    id: number;
    name: string;
    email: string;
  };
  
  // API isteğini ayırmak en iyi pratik
  export async function fetchUsers(): Promise<User[]> {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      cache: "no-store", // SSR her seferinde güncel data
    });
  
    if (!res.ok) throw new Error("Failed to fetch users");
  
    return res.json();
  }