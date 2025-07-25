import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const users = [ ];
//Kullanıcı ekleme 
router.post('/', (req, res) => {
    const user = req.body;

    users.push({ ...user, id: uuidv4() });

    res.send(`${user.adi} kullanıcı eklendi`);
})
//Kullanıcı listeleme
router.get('/', (req, res) => {
    res.send(users);
})
//Kullanıcıları silme ID girilen
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  users = users.filter((user) => user.id !== id)

  res.send(`${id} kullanıcı veri tabanından silindi`);
});
//ID verilen kullanıcı listeleme
router.get('/:id', (req, res) => {
    const { id } = req.params;

    const foundUser = users.find((user) => user.id === id)

    res.send(foundUser)
});
//Kullanıcı bilgileri güncelleme
router.patch('/:id', (req, res) => {
  const { id } = req.params;

  const { adi, soy_adi, email} = req.body;

  const user = users.find((user) => user.id === id)

  if(adi) user.adi = adi;
  if(soy_adi) user.soy_adi = soy_adi;
  if(email) user.email = email;

  res.send(`${id} ID ye sahip kulanıcı güncellendi`)

});

export default router