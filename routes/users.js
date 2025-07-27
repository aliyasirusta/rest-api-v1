import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

let users = [];

//Yetkilendirme yapıldı
const authorizeRole = (requiredRole) => (req, res, next) => {
  const currentUserId = req.headers["x-user-id"];

  if (!currentUserId) {
    return res
      .status(401)
      .send(
        'Yetkilendirme Gerekli: Lütfen "X-User-Id" bölümüne Admin ID giriniz.'
      );
  }

  const currentUser = users.find((u) => u.id === currentUserId);

  if (!currentUser) {
    return res
      .status(401)
      .send(
        "Yetkilendirme Gerekli: Geçersiz kullanıcı ID'si veya oturum açılmamış."
      );
  }

  if (currentUser.role !== requiredRole) {
    return res
      .status(403)
      .send(
        `Erişim Reddedildi: Sadece ${requiredRole} rolüne sahip kullanıcılar bu işlemi yapabilir.`
      );
  }
  req.user = currentUser;
  next();
};
//Kullanıcı ekleme
router.post("/", (req, res) => {
  const user = req.body;
  const newUser = { ...user, id: uuidv4(), role: user.role || "user" };
  users.push(newUser);

  res.send(`${newUser.adi} kullanıcı eklendi (Rol: ${newUser.role})`);
});

//Kullanıcıları silme ID girilen (Sadece admin'ler silebilir)
router.delete("/:id", authorizeRole("admin"), (req, res) => {
  const { id } = req.params;

  const initialLength = users.length;
  users = users.filter((user) => user.id !== id);

  if (users.length < initialLength) {
    res.send(`${id} kullanıcı veri tabanından silindi`);
  } else {
    res.status(404).send(`${id} ID'li kullanıcı bulunamadı.`);
  }
});
//ID verilen kullanıcı listeleme
router.get("/:id", (req, res) => {
  const { id } = req.params;

  const foundUser = users.find((user) => user.id === id);

  res.send(foundUser);
});
//Kullanıcı bilgileri güncelleme
router.patch("/:id", (req, res) => {
  const { id } = req.params;

  const { adi, soy_adi, email } = req.body;

  const user = users.find((user) => user.id === id);

  if (adi) user.adi = adi;
  if (soy_adi) user.soy_adi = soy_adi;
  if (email) user.email = email;

  res.send(`${id} ID ye sahip kulanıcı güncellendi`);
});
//Kullanıcı listeleme ve filtreleme
router.get("/", (req, res) => {
  const { adi, email } = req.query;
  let filteredUsers = users;

  if (adi) {
    const initialCount = filteredUsers.length;
    filteredUsers = filteredUsers.filter((user) => {
      const matches =
        user.adi && user.adi.toLowerCase().includes(adi.toLowerCase());
      return matches;
    });
  }

  if (email) {
    const initialCount = filteredUsers.length;
    filteredUsers = filteredUsers.filter((user) => {
      const matches =
        user.email && user.email.toLowerCase().includes(email.toLowerCase());
      return matches;
    });
  }
  res.send(filteredUsers);
});

export default router;
