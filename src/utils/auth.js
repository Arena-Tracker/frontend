// src/utils/auth.js

/**
 * Decodifică manual un JWT fără a folosi librării externe.
 */
export const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("0" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    console.log(JSON.parse(jsonPayload));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Eroare la decodarea token-ului:", e);
    return null;
  }
};

/**
 * Extrage și standardizează utilizatorul curent din LocalStorage.
 * O poți apela în orice fișier din aplicație pentru a afla cine e logat!
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = decodeToken(token);
  if (!decoded) return null;

  // Standardizăm return-ul ca să nu ne pese cum l-a numit backend-ul
  // Căutăm id, userId, idUser, sau idBazaSportiva
  const realId =
    decoded.id ||
    decoded.idReferinta ||
    decoded.idUser ||
    decoded.idBazaSportiva;

  return {
    id: realId,
    role: decoded.role || decoded.authorities?.[0], // Funcționează și cu roluri simple și cu Spring Security Authorities
    email: decoded.sub || decoded.email,
    rawToken: token, // Oprim și token-ul brut în caz că avem nevoie să-l punem în headere la fetch
  };
};
