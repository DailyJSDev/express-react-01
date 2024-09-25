import express from 'express';

const router = express.Router();

const users = [];
let nextId = 0;

router.get('/all', (req, res, next) => {
  if (users.length > 0) {
    res.status(200).json({ users: users });
  } else {
    res.status(200).send('no users to return.');
  }
});

router.get('/:id', (req, res, next) => {
  res.status(200).send(`sending user ${req.params.id}`);
});

router.post('/', (req, res, next) => {
  const {
    user: { firstname, lastname },
  } = req.body;
  console.log(`Received user ${JSON.stringify(req.body)}`);

  const newUser = {
    id: nextId++,
    firstname,
    lastname,
  };

  users.push(newUser);
  console.log('nextId', nextId);

  res.status(201).json(newUser);
});

export default router;
