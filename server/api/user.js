import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

const router = express.Router();

const client = new MongoClient(process.env.mongoURL);
const mlb_database = client.db('mlb_scores');
const mlb_users = mlb_database.collection('users');

router.get('/all', async (req, res, next) => {
  const allUsersStream = await mlb_users.find().stream();

  let results = [];

  allUsersStream.on('data', (data) => {
    results = [...results, data];
  });

  allUsersStream.on('error', (err) => {
    console.error(err);
    err.sourceURL = req.url;
    err.method = url.method;
    next(err);
  });

  allUsersStream.on('end', () => {
    if (results.length) {
      res.status(200).json({ users: results });
    } else {
      res.status(200).send('no users to return.');
    }
  });
});

router.get('/:id', (req, res, next) => {
  res.status(200).send(`sending user ${req.params.id}`);
});

router.post('/', async (req, res, next) => {
  const {
    user: { firstname, lastname },
  } = req.body;

  try {
    // 1- Verify that a user with the same first and last name don't already exist
    const query = { firstname: firstname, lastname: lastname };
    const resultUser = await mlb_users.findOne(query);

    if (resultUser) {
      // 2- If the user already exist, don't create and redirect to login
      res.status(200).send('the user already exist');
    } else {
      // 3- If the user doesn't exist, create it in the database
      const newUser = {
        firstname,
        lastname,
      };

      const insertResult = await mlb_users.insertOne(newUser);

      const newLocalUser = {
        id: insertResult.insertedId,
        firstname,
        lastname,
      };

      res.status(201).json(newLocalUser);
    }
  } catch (err) {
    err.sourceURL = req.url;
    err.method = req.method;
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  const { id: userId } = req.params;
  const { favorite } = req.body;

  try {
    const result = await mlb_users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { favorite: favorite } },
    );
    console.log(result);
    const { matchedCount, modifiedCount } = result;
    if (!matchedCount || !modifiedCount) {
      res.status(204).send('user cannot be found');
    } else {
      const response = { id: userId, favorite: favorite };
      res.status(201).json(response);
    }
  } catch (err) {
    console.log('Error while saving user in MongoDB');
    console.error(err);
    err.sourceURL = `/url/${userId}`;
    err.method = 'PATCH';
    next(err);
  }
});

export default router;
