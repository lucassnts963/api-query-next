import { useRouter } from "next/router";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remover o token de autenticação armazenado no localStorage (ou cookie)
    localStorage.removeItem("authToken"); // ou document.cookie = "authToken=; Max-Age=0"

    // Redirecionar o usuário para a página de login
    router.push("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
}
