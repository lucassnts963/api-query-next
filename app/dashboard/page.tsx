"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/auth"; // Certifique-se de que o tipo User está definido

export default function DashboardPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }
    setToken(storedToken);

    // Verificar token e obter dados do usuário
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Token inválido ou expirado");
        }

        const data = await response.json();
        setUser(data.user); // Assumindo que o endpoint retorna { user: { name: string, ... } }
      } catch (error) {
        console.error(error);
        signOut(); // Caso o token seja inválido, deslogar o usuário
      }
    };

    fetchUser();
  }, [router]);

  function signOut() {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/login"); // Redireciona para a página de login após o logout
  }

  if (!token || !user) return null; // Renderiza nada até que o token e o user sejam verificados

  return (
    <div>
      <h1>Bem-vindo, {user.name}!</h1>
      <Button onClick={signOut}>Sair</Button>
    </div>
  );
}
